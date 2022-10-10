const APP_ROUTES = {
  HOME: "/",
  SIGN_UP: "/signup",
  LOGIN: "/login",
  LOGOUT: "/logout",
  VERIFY_EMAIL: "/confirmation/:token",
};

const FLASH_MESSAGE_TYPES = {
  SUCCESS: "success",
  INFO: "info",
  ERROR: "error",
};

const ROLES = {
  ADMIN: "admin",
  USER: "user",
  PARTICIPANT: "participant",
};

module.exports = {
  ROLES,
  APP_ROUTES,
  FLASH_MESSAGE_TYPES,
};
