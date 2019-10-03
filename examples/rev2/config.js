const path = require("path");

module.exports = {
  baseDir: path.join(__dirname, ".", "actions"),
  isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")),
  accessTokenKey: "accessToken", // The cookie key name
  redis: {
    enabled: true,
    mock:
      process.env.REDIS_MOCK && process.env.REDIS_MOCK == "false"
        ? false
        : true,
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.REDIS_PASSWORD || "password123"
  }
};
