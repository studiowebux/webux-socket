// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const find = () => {
  return new Promise(async (resolve, reject) => {
    console.log("Start the search of the entry");
    console.log("then wait 3 seconds");
    await timeout(3000);
    return reject(new Error("No profiles found !"));
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error("Profile not found."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

const socket = (client, io) => {
  return async body => {
    console.log("called !");
    try {
      const obj = await find(body).catch(e => {
        console.error(e);
        throw e;
      });
      if (!obj) {
        console.error("No Object");
        throw new Error("Profiles not found");
      }

      console.log("Profile Found !");
      io.emit("userFound", obj);
    } catch (e) {
      console.error(e);
      client.emit("gotError", e.message);
    }
  };
};

module.exports = {
  find,
  route,
  socket
};
