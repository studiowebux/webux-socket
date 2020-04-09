# Webux Socket

OBSOLETE !!! TBD


This module is a wrapper for socket.io.  
it allows to automatically build the socket resources based on a given directory.

## Installation

### Linux

```bash
npm i --save @studiowebux/socket
```

### Windows

```bash
npm i --save @studiowebux/socket
```

### Mac

```bash
npm i --save @studiowebux/socket
```

## Usage

### The default configuration

/config/socket.js

```javascript
module.exports = {
  baseDir: path.join(__dirname, "..", "api", "v1", "actions"),
  isAuthenticated: require(path.join(__dirname, "..", "isAuth.js")),
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

| Option          | Description                                                                                                                            | Mandatory |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| baseDir         | The directory that contains the socket actions (the .on)                                                                               | Yes       |
| isAuthenticated |   It has to be a function isAuth(accessToken, callback)                                                                                | No        |
| accessTokenKey  |  The key/value of the 'accessToken':'SOME_JWT_STRING'                                                                                  | No        |
| redis           |  To configure redis, it will allow you to run multiple instances/processes of your backend and the socket will be emitted to everyone. | No        |

> You will not be able to test the cluster mode with the Redis mock implementation.

Inside the baseDir directory, the files selected are only the .js file that export the socket function.  
actions/aModule/feature1.js

```javascript
// Removed the action createProfile(body) from the example
// Full example, check the examples/ directories

const socket = (client, io) => {
  return async body => {
    try {
      const obj = await createProfile(body).catch(e => {
        throw e;
      });
      if (!obj) {
        throw new Error("Profile not created");
      }

      io.emit("profileCreated", obj);
      // client.emit("profileCreated", obj); // to broadcast to only the client
    } catch (e) {
      client.emit("gotError", e.message);
    }
  };
};

module.exports = {
  socket
};
```

### Functions

#### webuxSocket(options, server, console)

It returns a Promise with the socket instance,

| Option  | Description              | Mandatory |
| ------- | ------------------------ | --------- |
| options | The module configuration | Yes       |
| server  | The express server       | Yes       |
| console | To use a custom logger   | No        |

### Example

Check the /examples directory.

#### isAuth(accessToken, callback)

```javascript
function isAuth(accessToken, callback) {
  try {
    jwt.verify(accessToken, "HARDCODED_JWT_SECRET", (err, user) => {
      if (err || !user) {
        console.error("No user found...");
        return callback(err || new Error("No user found"));
      }

      console.debug("Checking token...");

      /* You Can add more validatation steps here, for example confirm the validity of the token in an external database */
      console.debug("Token valid !");
      return callback(null, user);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
```

#### An action

```javascript
const cluster = require("cluster");

// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const createProfile = body => {
  return new Promise(async (resolve, reject) => {
    if (!body) {
      console.log("No Body !");
      return reject(new Error("Body is not present !"));
    }
    console.log("Start the creation of the entry");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({
      msg: "Success !",
      cluster: cluster && cluster.worker ? cluster.worker.id : "Single Node"
    });
  });
};

// express route
const route = async (req, res, next) => {
  try {
    const obj = await createProfile(req.body);
    if (!obj) {
      return next(new Error("Profile not created."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// Socket Action
const socket = (client, io) => {
  return async body => {
    console.log("called !");
    try {
      const obj = await createProfile(body).catch(e => {
        console.error(e);
        throw e;
      });
      if (!obj) {
        console.error("No Object");
        throw new Error("Profile not created");
      }

      console.log("Profile Created !");
      io.emit("profileCreated", obj);
      // client.emit("profileCreated", obj); // to broadcast to only the client
    } catch (e) {
      console.error(e);
      client.emit("gotError", e.message);
    }
  };
};

module.exports = {
  createProfile,
  socket,
  route
};
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
