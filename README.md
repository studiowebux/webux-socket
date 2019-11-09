# Webux Socket

This module is a wrapper for socket.io
it allows to build automatically the socket resource based on a given directory.

## Installation

```bash
npm i --save @studiowebux/socket
```

## Usage

### The configuration

Default for production,

```javascript
module.exports = {
  baseDir: path.join(__dirname, "..", "api", "v1", "actions"),
  isAuthenticated: require(__dirname, path.join("..", "isAuth.js")),
  accessTokenKey: "accessToken",
  redis: {
    enabled: true,
    mock:
      process.env.REDIS_MOCK && process.env.REDIS_MOCK == "false"
        ? false
        : false,
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.REDIS_PASSWORD || "password123"
  }
};
```

The _baseDir_ is the directory that contains the socket actions (the .on)

The _isAuthenticated_ has to be a function, you can do it like the example above, or you can also write the function directly in the configuration file.
It must contains the accessTokenValue as the first parameter and a callback for second.

The _accessTokenKey_ is not the VALUE, this is the key name of the cookie, for example the cookie will contain a key/value of 'accessToken':'SOME_JWT_STRING'

The _redis_ object is use to configure redis, it will allow you to run multiple instances/processes of your backend and the socket will be emitted to everyone.

**You will not be able to test the cluster mode with the Redis mock implementation.**

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
