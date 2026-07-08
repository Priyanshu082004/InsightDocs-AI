 const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
});

 const ROLE_VALUES = Object.values(ROLES);


 const ACCESS_LEVELS = Object.freeze({
  OWNER: "OWNER",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
});

 const ACCESS_LEVEL_VALUES = Object.values(ACCESS_LEVELS);

// Ordered weakest → strongest, used by permission-checking logic in
// Phase 4/7 to answer "does this user's level satisfy the requirement".
 const ACCESS_LEVEL_RANK = Object.freeze({
  VIEWER: 1,
  EDITOR: 2,
  OWNER: 3,
});



export { ROLES, ROLE_VALUES, ACCESS_LEVELS, ACCESS_LEVEL_VALUES, ACCESS_LEVEL_RANK };