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
    const [participants, setParticipants] = useState<string[]>([]);
    const [notification, setNotification] = useState("");
    const [typingUser, setTypingUser] = useState("");


    const [isRecording, setIsRecording] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const createPeerConnection = (roomId: string) => {
      peerRef.current =new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      peerRef.current.oniceconnectionstatechange = () => {
        console.log(
          "ICE State:",
          peerRef.current?.iceConnectionState
        );
      };

      peerRef.current.onconnectionstatechange = () => {
        console.log(
          "Connection State:",
          peerRef.current?.connectionState
        );
      };

      peerRef.current.ontrack = (event) => {
        console.log("Remote stream received");

        const stream = event.streams[0];
          
        if (
          remoteVideoRef.current && 
          remoteVideoRef.current.srcObject !== stream
        ) {
          remoteVideoRef.current.srcObject = stream;

          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current
            ?.play()
            .catch(console.error);
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

    //screenshare
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

    //message
    const sendMessage = () => {
      if (!message.trim()) return;

      const mentionMatch = 
      message.match(/@(\w+)/);

      if (mentionMatch) {
        socket.emit(
          "mention-user",
          mentionMatch[1]
        );
      }

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

    //Transcription
    const startTranscription = () => {
      const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = true;
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

    //start Record
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

    //stop Record
    const stopRecording =() => {
      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current!.onstop = () => {
        const blob = new Blob(
          recordedChunksRef.current,
          {
            type: "video/webm",
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

    // Mute
    const toggleMute = () => {
      const stream = 
      localVideoRef.current?.srcObject as MediaStream;

      if (!stream) return;

      const audioTrack = stream
        .getAudioTracks()[0];

        if (!audioTrack) return;

        audioTrack.enabled = 
        !audioTrack.enabled;

        setIsMuted(!audioTrack.enabled);

        console.log(
          audioTrack.enabled? "Microphone ON"
          : "Microphone OFF"
        );
    };

    // leave meeting
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

    console.log("Leave Meeting clicked");

    const employeeId = 
      localStorage.getItem("employeeId") || "EMP001";
     
     console.log("Sending leave-room event");
      
     socket.emit("leave-room", {
      roomId: meetingCode,
      employeeId,
     });

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

    socket.on(
      "notification",
      (message: string) => {

        setNotification(message);

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    );

    // Join room

    socket.on("user-joined", async (id) => {
      setNotification(`🟢 ${id.slice(0, 6)} joined`);

      setTimeout(() => {
        setNotification("");
      }, 3000);

      console.log("User joined room:", id);

      if (
        peerRef.current?.signalingState != "stable"
      ) {
        console.log(
          "Skipping offer - peer not stable"
        );
        return;
      }

      console.log("Creating offer for:", id);

      if (!peerRef.current) return;

      const offer = await peerRef.current.createOffer();

      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        roomId: meetingCode,
        offer,
      });
    });

    // user left
    socket.on("user-left", (userId) => {
      setNotification(
        `🔴 ${userId.slice(0, 6)} left`
      );

      setTimeout(() => {
        setNotification("");
      }, 3000);

      console.log("User left:", userId);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    //offer
    socket.on("offer", async ({ offer }) => {
      console.log("Offer received");
      
      if(!peerRef.current) return;

      console.log(
        "Current state:",
        peerRef.current.signalingState
      );

      if (
        peerRef.current.signalingState !== "stable"
      ) {
        console.log(
          "Ignoring duplicate offer"
        );
        return;
      }

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

    // answer
    socket.on("answer", async ({ answer }) => {
      console.log("Answer received");

      if (!peerRef.current) return;

      if (
        peerRef.current.signalingState !==
        "have-local-offer"
      ) {
        console.log(
          "Ignoring duplicate answer"
        );
        return;
      }

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

    socket.on("typing", (userId) => {
      setTypingUser(`${userId} is typing...`);

      setTimeout(() => {
        setTypingUser("");
      }, 1000);
     });

    socket.on("participants-update", (participantsList: string[]) => {
        console.log("Participants:", participantsList);

        setParticipants(
          [...new Set(participantsList)]
        );
      }
    );


   // start camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        createPeerConnection(meetingCode);

        stream.getTracks().forEach((track) => {
          peerRef.current?.addTrack(track, stream);
       });

       const employeeId = 
         localStorage.getItem("employeeId") || "EMP001";

      socket.emit("join-room", {
        roomId: meetingCode,
        employeeId,
      });
        
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
      socket.off("notification");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("participants-update");
      socket.off("chat-message");
      socket.off("typing");

      peerRef.current?.close();
    };
  }, [meetingCode]);

  return (
    <div>
      <h1>Video Call Room</h1>
      <h2>Meeting Code: {meetingCode}</h2>

      {notification && (
        <div 
          style={{
            background: "#eee",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          >
            {notification}
            </div>
      )}

      <button onClick={startScreenShare}>
        Share Screen
      </button>

      <button onClick={toggleMute}>
        {isMuted ? "🎤 Unmute": "🔇 Mute"}
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

          <div
           style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "20px",
           }}
          >

            <h3>
              Participants ({participants.length})
            </h3>

            {participants.map((participant) => (
              <li key={participant}>
                🟢 Online - {participant.slice(0, 6)}
                </li>
            ))}

        </div>



          <h3>Meeting chat</h3>

          <p>{typingUser}</p>
          

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
              onChange={(e) => {
                setMessage(e.target.value);


                socket.emit(
                  "typing",
                  meetingCode
                );
              }}
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
        controls={false}
        width={400}
        height={300}
        style={{
          width: "400px",
          height: "300px",
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