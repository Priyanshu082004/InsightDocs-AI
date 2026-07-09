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


export const updateProfile = async (userId, updates) => {
  return User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
};
 
export const updatePasswordHash = async (userId, passwordHash) => {
  return User.findByIdAndUpdate(userId, { passwordHash }, { new: true });
};
 
export const updateRole = async (userId, role) => {
  return User.findByIdAndUpdate(userId, { role }, { new: true });
};
 
export const setActiveStatus = async (userId, isActive) => {
  return User.findByIdAndUpdate(userId, { isActive }, { new: true });
};
 
export const findByIdWithPassword = async (id) => {
  return User.findById(id).select("+passwordHash");
};
 
export const listUsers = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
};