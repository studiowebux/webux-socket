// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const find = () => {
  return new Promise(async (resolve, reject) => {
    console.log("Start the search of the entry");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({ msg: "Success !" });
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await find();
    if (!obj) {
      return next(new Error("User not found."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  find,
  route
};
