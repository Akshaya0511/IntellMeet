import { useEffect, useRef, type RefObject } from "react";
import { socket } from "../services/socket";

interface UseWebRTCReturn {
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
}

export const useWebRTC = (
  roomId: string,
  userId: string
): UseWebRTCReturn => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const config: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ],
  };

  useEffect(() => {
    init();

    return () => {
        socket.emit("leave-room", {
            roomId,
            employeeId: userId,
        });

        peerRef.current?.close();

        localStreamRef.current?.getTracks().forEach((track ) => {
            track.stop()
    });


      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId, userId]);

  const init = async () => {
    await getUserMedia();

    createPeerConnection();

    setupSocketEvents();

    socket.emit("join-room", {
        roomId,
        employeeId: userId,
    });
  };

  

  // 🎥 Camera + Mic
  const getUserMedia = async () => {
    try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  } catch (error) {
    console.error("Unable to access camera/microphone", error);
  }
  };


  // 🔗 Peer Connection
  const createPeerConnection = () => {
    peerRef.current = new RTCPeerConnection(config);


  if (localStreamRef.current) {
    localStreamRef.current?.getTracks().forEach((track) => {
      peerRef.current?.addTrack(track, localStreamRef.current!);
    });
}
  
    peerRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };
  };

  // 🔌 Socket Events
  const setupSocketEvents = () => {
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");

    socket.on("user-joined", async () => {
        if (!peerRef.current) return;

      const offer = await peerRef.current?.createOffer();

      await peerRef.current?.setLocalDescription(offer!);

      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async ({ offer }) => {
        if (!peerRef.current) return;

      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerRef.current?.createAnswer();
      await peerRef.current?.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
        if (!peerRef.current) return;

      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
        if (!peerRef.current || !candidate) return;

    });
  };

  return {
    localVideoRef,
    remoteVideoRef,
  };
};