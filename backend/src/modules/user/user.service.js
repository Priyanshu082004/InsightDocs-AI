import bcrypt from "bcrypt";
import * as userRepository from "./user.repository.js";
import * as auditService from "../audit/audit.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { AUDIT_ACTION } from "../../constants/system.constant.js";

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const getUserOrThrow = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }
  return user;
};

export const getProfile = async (userId) => {
  const user = await getUserOrThrow(userId);
  return sanitizeUser(user);
};

export const updateProfile = async (userId, updates) => {
  const user = await userRepository.updateProfile(userId, updates);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.USER_PROFILE_UPDATE,
    resourceType: "User",
    resourceId: userId,
    metadata: { fields: Object.keys(updates) },
  });

  return sanitizeUser(user);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const userWithPassword = await userRepository.findByIdWithPassword(userId);
  if (!userWithPassword) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash);
  if (!isCurrentValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Current password is incorrect");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userRepository.updatePasswordHash(userId, newPasswordHash);

  // Changing your password should end every existing session, on the
  // assumption that the change may be a reaction to a suspected
  // compromise — force a fresh login everywhere, not just this device.
  await userRepository.clearRefreshTokenHash(userId);

  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.USER_PASSWORD_CHANGE,
    resourceType: "User",
    resourceId: userId,
  });
};

export const listUsers = async ({ page, limit }) => {
  const result = await userRepository.listUsers({ page, limit });
  return { ...result, items: result.items.map(sanitizeUser) };
};

export const getUserById = async (userId) => {
  const user = await getUserOrThrow(userId);
  return sanitizeUser(user);
};

export const updateUserRole = async (adminId, targetUserId, role) => {
  const targetUser = await getUserOrThrow(targetUserId);

  if (targetUser._id.toString() === adminId.toString()) {
    // An admin demoting/promoting themselves is how you accidentally
    // lock yourself out of admin routes with no one left to fix it.
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You cannot change your own role");
  }

  const previousRole = targetUser.role;
  const updated = await userRepository.updateRole(targetUserId, role);

  await auditService.logAction({
    userId: adminId,
    action: AUDIT_ACTION.USER_ROLE_UPDATE,
    resourceType: "User",
    resourceId: targetUserId,
    metadata: { from: previousRole, to: role },
  });

  return sanitizeUser(updated);
};

export const setUserActiveStatus = async (adminId, targetUserId, isActive) => {
  const targetUser = await getUserOrThrow(targetUserId);

  if (targetUser._id.toString() === adminId.toString() && !isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You cannot deactivate your own account");
  }

  const updated = await userRepository.setActiveStatus(targetUserId, isActive);

  if (!isActive) {
    // Deactivation should end their sessions immediately, not wait for
    // their access token to expire on its own.
    await userRepository.clearRefreshTokenHash(targetUserId);
  }

  await auditService.logAction({
    userId: adminId,
    action: isActive ? AUDIT_ACTION.USER_ACTIVATE : AUDIT_ACTION.USER_DEACTIVATE,
    resourceType: "User",
    resourceId: targetUserId,
  });

  return sanitizeUser(updated);
};