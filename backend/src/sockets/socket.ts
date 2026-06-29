import { Server, Socket } from "socket.io";
import * as attendanceService from "../services/hr/attendanceService";
import Meeting from "../models/Meeting";

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
    socket.on(
      "join-room",
      async (data: {
        roomId: string;
        employeeId: string;
      }) => {
        const { roomId: meetingId, employeeId } = data;

        socket.join(meetingId);

        if (!roomParticipants[meetingId]) {
        roomParticipants[meetingId] = [];
      }

      if (!roomParticipants[meetingId].includes(socket.id)) {
            roomParticipants[meetingId].push(socket.id);

      }

      const uniqueParticipants = [
        ...new Set(roomParticipants[meetingId]),
      ];

      io.to(meetingId).emit(
        "participants-update",
        uniqueParticipants
      );

      socket.to(meetingId).emit("user-joined", socket.id);

      console.log(`${employeeId} joined meeting ${meetingId}`);

      console.log("JOIN DATA:", {
        employeeId,
        meetingId,
      });

      try {
        await attendanceService.addAttendance({
          employeeId,
          meetingId,
        });

        console.log("Calling addAttendance...");

        console.log("Attendance marked automatically");

        console.log("Finished addAttendance");
        
      } catch (error: any) {
        console.log(error.message);
      }
    });
  
    //create task
    socket.on(
      "task-created",
      (task) => {
        io.emit(
          "notification",
          `New Task Created: ${task.Title}`
        );
      }
    );

// update task
    socket.on(
      "task-status-completed",
      (task) => {
        socket.broadcast.emit(
          "task-status-updated",
          task
        );
      }
    );

    // delete task
    socket.on(
      "task-deleted",
      (taskId: string) => {

        socket.broadcast.emit(
          "task-deleted",
          taskId
        );
      }
    );

    // complete Task
    socket.on("task-completed", (taskTitle: string) => {
      io.emit(
        "notification",
        `Task Completed: ${taskTitle}`
      );
    });

    // Mention User
    socket.on("mention-user", (username: string) => {
      io.emit(
        "notification",
        `${username} was mentioned`
      );
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

    socket.on("typing", (roomId) => {
      socket.to(roomId).emit("typing", socket.id);
    });

    socket.on("leave-room", async (data: {
      roomId: string;
      employeeId: string;
    }) => {
      const { roomId: meetingId, employeeId } = data;

      console.log(`${employeeId} left meeting ${meetingId}`);

      console.log("LEAVE DATA:", {
        employeeId,
        meetingId,
      });
     
      try {
        const attendance = 
          await attendanceService.checkOutAttendance(
            employeeId,
            meetingId
          );

          console.log("Checked out successfully");
          console.log(attendance);
      } catch (error: any) {
        console.log(error.message);
      }
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