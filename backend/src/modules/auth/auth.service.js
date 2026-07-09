import bcrypt from "bcrypt";
import * as userRepository from "../user/user.repository.js";
import * as auditService from "../audit/audit.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/tokenGenerator.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { AUDIT_ACTION } from "../../constants/system.constant.js";

const SALT_ROUNDS = 10;

// Never return the Mongoose document directly to a controller — strip
// passwordHash/refreshTokenHash even though they're `select: false` by
// default, as defense in depth against a future query that accidentally
// does `.select("+passwordHash")` upstream of this function.
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

const issueTokenPair = async (user) => {
  const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  await userRepository.updateRefreshTokenHash(user._id, hashToken(refreshToken));

  return { accessToken, refreshToken };
};

export const register = async ({ name, email, password }, { ipAddress } = {}) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepository.createUser({ name, email, passwordHash });

  const tokens = await issueTokenPair(user);

  await auditService.logAction({
    userId: user._id,
    action: AUDIT_ACTION.USER_REGISTER,
    resourceType: "User",
    resourceId: user._id,
    ipAddress,
  });

  return { user: sanitizeUser(user), ...tokens };
};

export const login = async ({ email, password }, { ipAddress } = {}) => {
  const user = await userRepository.findByEmail(email, { withPassword: true });

  // Deliberately identical error for "no such user" and "wrong password"
  // — a distinct message would let an attacker enumerate registered
  // emails by probing the login endpoint.
  const invalidCredentialsError = new ApiError(
    HTTP_STATUS.UNAUTHORIZED,
    "Invalid email or password"
  );

  if (!user || !user.isActive) {
    throw invalidCredentialsError;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  const tokens = await issueTokenPair(user);

  await auditService.logAction({
    userId: user._id,
    action: AUDIT_ACTION.USER_LOGIN,
    resourceType: "User",
    resourceId: user._id,
    ipAddress,
  });

  return { user: sanitizeUser(user), ...tokens };
};

export const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const user = await userRepository.findById(decoded.id, { withRefreshTokenHash: true });
  if (!user || !user.refreshTokenHash) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Session expired, please log in again");
  }

  const incomingHash = hashToken(incomingRefreshToken);

  if (incomingHash !== user.refreshTokenHash) {
    // Hash mismatch on a token that passed JWT verification means this
    // exact token was already rotated out — i.e. someone is replaying an
    // old refresh token. Treat this as possible theft: kill the session
    // entirely rather than silently issuing new tokens.
    await userRepository.clearRefreshTokenHash(user._id);
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Session invalidated due to token reuse — please log in again"
    );
  }

  // Rotation: every refresh issues a brand new pair and overwrites the
  // stored hash, so a leaked-but-unused old refresh token stops working
  // the moment the legitimate client refreshes once.
  return issueTokenPair(user);
};

export const logout = async (userId) => {
  await userRepository.clearRefreshTokenHash(userId);
  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.USER_LOGOUT,
    resourceType: "User",
    resourceId: userId,
  });
};