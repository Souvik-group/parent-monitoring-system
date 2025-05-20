// src/routes/Attendance.jsx
import React, { useEffect, useRef } from "react";
import {
    listenForOffer,
    sendAnswer,
    clearRoom,
  } from "../webrtc/signaling";
  
  
const Attendance = () => {
  const videoRef = useRef();
  const pc = useRef(new RTCPeerConnection());

  useEffect(() => {
    const start = async () => {
      listenForOffer(async (offer) => {
        await pc.current.setRemoteDescription(offer);
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        await sendAnswer(answer);
      });

      pc.current.ontrack = (event) => {
        videoRef.current.srcObject = event.streams[0];
      };
    };

    start();

    return () => {
      pc.current.close();
      clearRoom();
    };
  }, []);

  return (
    <div>
      <h2>Attendance (Laptop)</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default Attendance;
