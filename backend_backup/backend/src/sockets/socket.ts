import { Server, Socket } from "socket.io";

const roomParticipants: Record<string, string[]> = {};

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

      if (!roomParticipants[roomId]) {
        roomParticipants[roomId] = [];
      }

      if (!roomParticipants[roomId].includes(socket.id)) {
            roomParticipants[roomId].push(socket.id);

      }


      const uniqueParticipants = [
        ...new Set(roomParticipants[roomId]),
      ];

      io.to(roomId).emit(
        "participants-update",
        uniqueParticipants
      );

      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on(
      "task-created",
      (taskTitle: string) => {
        io.emit(
          "notification",
          `New Task Created: ${taskTitle}`
        );
      }
    );

    socket.on(
      "task-completed",
      (taskTitle: string) => {
        io.emit(
          "notification",
          `Task Completed: ${taskTitle}`
        );
      }
    );

    socket.on(
      "mention-user",
      (username: string) => {

        io.emit(
          "notification",
          `${username} was mentioned`
        );
      }
    );

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

    socket.on("typing", (roomId) => {
      socket.to(roomId).emit("typing", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const roomId in roomParticipants) {
        roomParticipants[roomId] = 
        roomParticipants[roomId].filter(
          (id) => id !== socket.id
        );

        const uniqueParticipants = [
          ...new Set(roomParticipants[roomId]),
        ];

        io.to(roomId).emit(
          "participants-update",
          uniqueParticipants
        );
      }

      socket.broadcast.emit("user-left", socket.id);
    });
  });
};