const userController = require("../Controllers/user.controller");
const chatController = require("../Controllers/chat.controller");
const roomController = require("../Controllers/room.controller");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    socket.emit("rooms", await roomController.getAllRooms());
    socket.on("login", async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        // const welcomeMessage = {
        //   chat: `${user.name}님이 입장했습니다.`,
        //   user: { id: null, name: "system" },
        // };
        // io.emit("message", welcomeMessage);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("sendMessage", async (receivedMessage, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        if (user) {
          const message = await chatController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit("message", message);
          return cb({ ok: true });
        }
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("joinRoom", async (rid, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.joinRoom(rid, user);
        socket.join(user.room.toString());

        const welcomeMessage = {
          chat: `${user.name}님이 입장했습니다.`,
          user: { id: null, name: "system" },
        };
        io.to(user.room.toString()).emit("message", welcomeMessage);
        io.emit("rooms", await roomController.getAllRooms());
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("leaveRoom", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name}님이 퇴장했습니다.`,
          user: { id: null, name: "system" },
        };
        // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
        socket.broadcast.to(user.room.toString()).emit("message", leaveMessage);
        io.emit("rooms", await roomController.getAllRooms());
        socket.leave(user.room.toString());
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};
