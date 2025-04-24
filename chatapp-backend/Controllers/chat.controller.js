const Chat = require("../Models/chat");
const chatController = {};

chatController.saveChat = async (message, user) => {
  const newChat = new Chat({
    chat: message,
    user: {
      id: user._id,
      name: user.name,
    },
    room: user.room,
  });
  await newChat.save();
  return newChat;
};

module.exports = chatController;
