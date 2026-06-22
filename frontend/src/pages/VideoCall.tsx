import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { socket } from "../services/socket";
import axios from "axios";

declare global {
    interface Window {
      SpeechRecognition: any;
      webkitSpeechRecognition: any;
    }
  }

const VideoCall = () => {
  
    const { meetingCode } = useParams();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const [transcript, setTranscript] = useState("");

    const [isRecording, setIsRecording] = useState(false);

    const createPeerConnection = (roomId: string) => {
      peerRef.current =new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      peerRef.current.ontrack = (event) => {
        console.log("Remote stream received");
        console.log(event.streams);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];

          remoteVideoRef.current.onloadedmetadata = () => {
            console.log("Remote video metadata loaded");
            remoteVideoRef.current?.play();
          };
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

    const startScreenShare = async () => {
      try {
        const screenStream = 
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = 
        screenStream.getVideoTracks()[0];

        const sender = peerRef.current
        ?.getSenders()
        .find(
          (s) => s.track?.kind === "video"
        );

        await sender?.replaceTrack(screenTrack);

        console.log("Screen sharing started");
        } catch (error) {
          console.log("Screen share error:", error);
        }
    };

    const sendMessage = () => {
      if (!message.trim()) return;

      socket.emit("chat-message", {
        roomId: meetingCode,
        message,
      });

      setMessages((prev) => [
        ...prev,
        `Me: ${message}`,
      ]);

      setMessage("");
    };

    const startTranscription = () => {
      const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.continuos = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          finalTranscript += 
            event.results[i][0].transcript;
        }

        setTranscript(finalTranscript);
      };

      recognition.start();

      console.log("Transcription started");
    };

    const startRecording = async () => {
      try {
        const stream = localVideoRef.current?.srcObject as MediaStream;

        if (!stream) return;

        recordedChunksRef.current = [];

        const recorder = new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.start();

        setIsRecording(true);

        console.log("Recording started");
      } catch (err) {
        console.log(err);
      }
    };

    const stopRecording =() => {
      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current!.onstop = () => {
        const blob = new Blob(
          recordedChunksRef.current,
          {
            type: "video/webcam",
          }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "meeting.webm";

        a.click();

        URL.revokeObjectURL(url);

        setIsRecording(false);

        console.log("Recording saved");
      };
    };

    const leaveMeeting = async () => {
      const transcript = messages.join(". ");

      console.log("Transcript:", transcript);

      console.log("Meeting Mongo ID:", 
        localStorage.getItem("meetingMongoId")
      );

      const token = localStorage.getItem("accessToken");

      console.log("TOKEN:", token);

      console.log(
         "ACCESS TOKEN:",
         localStorage.getItem("accessToken")
      );

      console.log(
        "MEETING ID:",
        localStorage.getItem("meetingMongoId")
      );
    

      try {
        await axios.post(
        "http://localhost:5000/api/meetings/summary",
        {
          meetingId: localStorage.getItem("meetingMongoId"),
          transcript,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Meeting summary saved");
    } catch (err) {
      console.log("Summary error", err);
    } 

      peerRef.current?.close();

      const localStream =
        localVideoRef.current?.srcObject as MediaStream;

      localStream?.getTracks().forEach(track => {
        track.stop();
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;

      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      socket.disconnect();

      console.log("Meeting left");
    };


    useEffect(() => {
    if (!meetingCode) return;

    // Join room

    socket.on("user-joined", async (id) => {
      console.log("User joined room:", id);
      console.log("Creating offer for:", id);

      if (!peerRef.current) return;

      const offer = await peerRef.current.createOffer();

      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        roomId: meetingCode,
        offer,
      });
    });

    socket.on("user-left", (userId) => {
      console.log("User left:", userId);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socket.on("offer", async ({ offer }) => {
      console.log("Offer received");
      
      if(!peerRef.current) return;

      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerRef.current.createAnswer();

      await peerRef.current.setLocalDescription(answer);

      socket.emit("answer", {
        roomId: meetingCode,
        answer,
      });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Answer received");

      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("ICE candidate received");

      try {
        await peerRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.log("ICE Error:", err);
      }
    });

    socket.on("chat-message", ({ sender, message }) => {
      setMessages((prev) => [
        ...prev,
        `${sender}: ${message}`,
       ]);
    });


    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

      // start camera
      createPeerConnection(meetingCode);

      socket.emit("join-room", meetingCode);
      console.log("Joined room:", meetingCode);

      stream.getTracks().forEach((track) => {
        peerRef.current?.addTrack(track, stream);
        });

        console.log("Camera started");
      } catch (error) {
        console.log("Camera error:", error);
      }
    };

    startCamera();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");

      peerRef.current?.close();
    };
  }, [meetingCode]);

  return (
    <div>
      <h1>Video Call Room</h1>
      <h2>Meeting Code: {meetingCode}</h2>

      <button onClick={startScreenShare}>
        Share Screen
      </button>

      <button onClick={startTranscription}>
        Start Transcription
      </button>

      <button
         onClick={startRecording}
         disabled={isRecording}
         >
          Start Recording
         </button>

         <button
           onClick={stopRecording}
           disabled={!isRecording}
           >
            Stop Recording
           </button>

      <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h3>Local Video</h3>

        <button onClick={leaveMeeting}>
          Leave Meeting
        </button>

      <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      width={400}
      height={300}
      style={{
        border: "2px solid green",
        background: "black",
      }}
      />
      </div>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid gray",
          padding: "10px",
        }}
        >

          <h3>Meeting chat</h3>

          <div
            style={{
              height: "200px",
              overflowY: "auto",
              border: "1px solid black",
              marginBottom: "10px",
            }}
            >
              {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message"
              />

              <button onClick={sendMessage}>
                Send
              </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Live Transcript</h3>

          <textarea
             value={transcript}
             readOnly
             rows={8}
             cols={50}
             />
        </div>

      <div>
        <h3>Remote Video</h3>
        <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width={400}
        height={300}
        style={{
        border: "2px solid red",
        background: "black",
      }}
      />
    </div>
    </div>
    </div>
  );
};

export default VideoCall;