import { useWebRTC } from "../../hooks/useWebRTC";

interface VideoRoomProps {
    roomId: string;
    userId: string;
}

const VideoRoom = ({ roomId, userId }: VideoRoomProps) => {
  const { localVideoRef, remoteVideoRef } = useWebRTC(roomId, userId);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
        <video 
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          width={300}
        />

        <video 
          ref={remoteVideoRef}
          autoPlay
          playsInline
          width={300}  
         />
         </div> 
  );
};

export default VideoRoom;