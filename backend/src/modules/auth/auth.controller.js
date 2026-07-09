import * as authService from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { isProduction } from "../../config/env.config.js";

const REFRESH_COOKIE_NAME = "refreshToken";

// Centralized here so every place that sets/clears the cookie uses
// identical options — a mismatch (e.g. different `path`) between set
// and clear is a classic bug that leaves stale cookies behind.
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // matches JWT_REFRESH_EXPIRY default (7d)
  path: "/api/v1/auth",
};

export const register = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body, {
    ipAddress: req.ip,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, { user, accessToken }, "Registered successfully"));
};

export const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, {
    ipAddress: req.ip,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user, accessToken }, "Logged in successfully"));
};

export const refresh = async (req, res) => {
  const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { accessToken, refreshToken } = await authService.refreshTokens(incomingRefreshToken);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { accessToken }, "Token refreshed"));
};

export const logout = async (req, res) => {
  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authenticated");
  }

  await authService.logout(req.user.id);
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Logged out"));
};

export const getCurrentUser = async (req, res) => {
  // req.user is set by auth.middleware — this route exists mainly as a
  // sanity-check endpoint for the auth+RBAC middleware chain.
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user: req.user }, "Current user"));
};