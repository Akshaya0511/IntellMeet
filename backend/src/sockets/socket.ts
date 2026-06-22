import { Server, Socket } from "socket.io";


export const initSocket = (server: any) => {

  const io = new Server(server, {
    cors: { origin: "http://localhost:5173",
      methods: ["GET", "POST"],
     },
  });


  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    // OFFER
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { offer, sender: socket.id });
    });

    // ANSWER
    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { answer, sender: socket.id });
    });

    // ICE CANDIDATE
    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", {
        candidate,
        sender: socket.id,
      });
    });

    socket.on("chat-message", ({ roomId, message }) => {
      socket.to(roomId).emit("chat-message", {
        sender: socket.id,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      socket.broadcast.emit("user-left", socket.id);
    });
  });
};