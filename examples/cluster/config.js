const path = require("path");

module.exports = {
  baseDir: path.join(__dirname, ".", "actions"),
  isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")),
  accessTokenKey: "accessToken", // The cookie key name
  redis: {
    enabled: true,
    mock: false,
    host: "127.0.0.1",
    port: "6379",
    password: "password123"
  }
};
