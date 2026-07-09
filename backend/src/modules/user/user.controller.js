import * as userService from "./user.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";

export const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { user }));
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "Profile updated"));
};

export const changePassword = async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Password changed — please log in again"));
};

export const listUsers = async (req, res) => {
  const result = await userService.listUsers(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { user }));
};

export const updateUserRole = async (req, res) => {
  const user = await userService.updateUserRole(req.user.id, req.params.id, req.body.role);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "Role updated"));
};

export const deactivateUser = async (req, res) => {
  const user = await userService.setUserActiveStatus(req.user.id, req.params.id, false);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "User deactivated"));
};

export const activateUser = async (req, res) => {
  const user = await userService.setUserActiveStatus(req.user.id, req.params.id, true);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { user }, "User activated"));
};