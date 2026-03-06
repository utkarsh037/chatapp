const WebSocket = require("ws");
const Message = require("./models/messageModel");

// userId -> websocket mapping
let clients = {};

const setupWebSocket = (server) => {

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {

    console.log("New client connected");

    ws.on("message", async (raw) => {

      try {

        const data = JSON.parse(raw);

        // ── User joins ──
        if (data.type === "join") {
          clients[data.userId] = ws;
          ws.userId = data.userId;
          console.log("User joined:", data.userId);
        }

        // ── Send message ──
        if (data.type === "message") {

          const isGlobal = !data.to;

          // Save to DB
          await Message.create({
            sender: data.from,
            senderName: data.fromName || data.from,
            receiver: data.to || null,
            message: data.message,
            type: isGlobal ? "global" : "direct"
          });

          const payload = JSON.stringify({
            type: "message",
            from: data.from,
            fromName: data.fromName || data.from,
            message: data.message
          });

          if (isGlobal) {
            // Broadcast to ALL connected clients except sender
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });
          } else {
            // Send to specific receiver only
            const receiverSocket = clients[data.to];
            if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
              receiverSocket.send(payload);
            }
          }

        }

      } catch (err) {
        console.error("WebSocket message error:", err.message);
      }

    });

    ws.on("close", () => {
      // Clean up disconnected client
      if (ws.userId) {
        delete clients[ws.userId];
      }
      console.log("Client disconnected");
    });

  });

};

module.exports = setupWebSocket;