const WebSocket = require("ws");
const Message = require("./models/messageModel");

let clients = {};

const setupWebSocket = (server) => {

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {

    console.log("New client connected");

    ws.on("message", async (message) => {

      const data = JSON.parse(message);

      // user joins
      if (data.type === "join") {
        clients[data.userId] = ws;
        console.log("User joined:", data.userId);
      }

      // send message
      if (data.type === "message") {

        // save message in database
        await Message.create({
          sender: data.from,
          receiver: data.to,
          message: data.message
        });

        const receiverSocket = clients[data.to];

        if (receiverSocket) {
          receiverSocket.send(JSON.stringify({
            type: "message",
            from: data.from,
            message: data.message
          }));
        }

      }

    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

  });

};

module.exports = setupWebSocket;