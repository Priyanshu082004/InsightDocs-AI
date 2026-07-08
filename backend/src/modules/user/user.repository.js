import { User } from "./user.model.js";


export const createUser = async ({ name, email, passwordHash }) => {
  return User.create({ name, email, passwordHash });
};

export const findByEmail = async (email, { withPassword = false } = {}) => {
  const query = User.findOne({ email });
  if (withPassword) query.select("+passwordHash");
  return query;
};

export const findById = async (id, { withRefreshTokenHash = false } = {}) => {
  const query = User.findById(id);
  if (withRefreshTokenHash) query.select("+refreshTokenHash");
  return query;
};

export const updateRefreshTokenHash = async (userId, refreshTokenHash) => {
  return User.findByIdAndUpdate(userId, { refreshTokenHash }, { new: true });
};

export const clearRefreshTokenHash = async (userId) => {
  return User.findByIdAndUpdate(userId, { refreshTokenHash: null }, { new: true });
};