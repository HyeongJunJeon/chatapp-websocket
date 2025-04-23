const User = require("../Models/user");
const userController = {};

userController.saveUser = async (userName, socketId) => {
  let user = await User.findOne({ name: userName });

  if (!user) {
    user = new User({
      name: userName,
      token: socketId,
      online: true,
    });
  }

  user.token = socketId;
  user.online = true;
  await user.save();

  return user;
};

userController.checkUser = async (socketId) => {
  const user = await User.findOne({ token: socketId });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = userController;
