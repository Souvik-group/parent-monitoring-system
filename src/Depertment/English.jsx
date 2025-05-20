import React, { useRef, useState, useEffect } from "react";

const CLOUDINARY_URL_IMAGE = "https://api.cloudinary.com/v1_1/dwbyocbug/image/upload";
const CLOUDINARY_URL_VIDEO = "https://api.cloudinary.com/v1_1/dwbyocbug/video/upload";
const UPLOAD_PRESET = "unsigned_preset";

const uploadToCloudinary = async (fileBlob, resourceType = "image", context = {}) => {
  const formData = new FormData();
  formData.append("file", fileBlob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("tags", "snapshot,autocaption");

  const contextString = Object.entries(context)
    .map(([k, v]) => `${k}=${v}`)
    .join("|");
  if (contextString) formData.append("context", contextString);

  const uploadUrl = resourceType === "video" ? CLOUDINARY_URL_VIDEO : CLOUDINARY_URL_IMAGE;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  const caption = data?.info?.detection?.captioning?.data?.caption;
  if (caption) {
    const updateForm = new FormData();
    updateForm.append("context", `caption=${caption}`);
    updateForm.append("tags", "autocaption,snapshot");

    await fetch(`https://api.cloudinary.com/v1_1/dwbyocbug/${resourceType}/update/${data.public_id}`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa("your_api_key:your_api_secret"),
      },
      body: updateForm,
    });
  }

  console.log("✅ Uploaded to Cloudinary:", data);
  return data;
};

const English = () => {
  const streamURL = "http://192.168.3.153:8080/video";
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [recordingTimeLeft] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [streamError, setStreamError] = useState(false);
  const [location, setLocation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  const throttle = (fn) => {
    if (Date.now() - lastActionTime > 3000) {
      fn();
      setLastActionTime(Date.now());
    }
  };

  const saveBlobAsFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const captureSnapshot = async () => {
    const SNAPSHOT_URL = "http://192.168.3.153:8080/shot.jpg?rnd=" + Date.now();
    try {
      setIsUploading(true);
      const response = await fetch(SNAPSHOT_URL);
      if (!response.ok) throw new Error(`Snapshot fetch failed: ${response.status}`);

      const blob = await response.blob();
      if (!blob || blob.size === 0) throw new Error("Snapshot failed. Blob is empty.");

      saveBlobAsFile(blob, `snapshot-${Date.now()}.jpg`);

      await uploadToCloudinary(blob, "image", {
        lat: location?.latitude?.toFixed(5) || "unknown",
        lng: location?.longitude?.toFixed(5) || "unknown",
      });

      alert("📸 Snapshot saved locally and uploaded to Cloudinary!");
      setSnapshotSaved(true);
      setTimeout(() => setSnapshotSaved(false), 3000);
    } catch (err) {
      console.error("Snapshot error:", err);
      alert("❌ Snapshot capture/upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const startVideo = async () => {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      canvas.width = video.naturalWidth || video.videoWidth;
      canvas.height = video.naturalHeight || video.videoHeight;

      const context = canvas.getContext("2d");
      const FPS = 10;
      const intervalId = setInterval(() => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }, 1000 / FPS);

      const stream = canvas.captureStream(FPS);
      const recorder = new MediaRecorder(stream);
      recorderRef.current = { recorder, intervalId };

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Start video error:", err);
      alert("Failed to start video recording.");
    }
  };

  const stopVideo = async () => {
    try {
      const { recorder, intervalId } = recorderRef.current || {};
      if (!recorder) return;

      recorder.stop();
      clearInterval(intervalId);

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        chunksRef.current = []; // Clear chunks

        saveBlobAsFile(blob, `video-${Date.now()}.webm`);

        try {
          setIsUploading(true);
          await uploadToCloudinary(blob, "video", {
            lat: location?.latitude?.toFixed(5) || "unknown",
            lng: location?.longitude?.toFixed(5) || "unknown",
          });
          alert("🎉 Video uploaded to Cloudinary!");
        } catch (err) {
          console.error("Video upload failed:", err);
          alert("Video upload failed.");
        } finally {
          setIsUploading(false);
        }
      };

      setIsRecording(false);
    } catch (err) {
      console.error("Stop video error:", err);
      alert("Failed to stop video recording.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📷 English Depertment Live Camera Feed</h2>
      <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>
        🕒 Current Time: {currentTime.toLocaleTimeString()}
      </p>
      <img
        ref={videoRef}
        src={streamURL}
        alt="Live Stream"
        crossOrigin="anonymous"
        onError={() => setStreamError(true)}
        style={{
          width: "100%",
          maxWidth: "720px",
          border: "2px solid #ccc",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#000",
        }}
      />
      {streamError && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ❌ Could not load stream. Make sure your IP camera is running.
        </p>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => throttle(captureSnapshot)}
          disabled={isUploading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: isUploading ? "#888" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isUploading ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          {isUploading ? "Uploading..." : "📸 Capture Snapshot"}
        </button>
        <button
          onClick={isRecording ? stopVideo : startVideo}
          disabled={isUploading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: isUploading ? "#888" : isRecording ? "#f44336" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isUploading ? "not-allowed" : "pointer",
          }}
        >
          {isUploading ? "Uploading..." : isRecording ? "🛑 Stop Video" : "▶️ Start Video"}
        </button>
      </div>
      {recordingTimeLeft > 0 && (
        <p style={{ color: "#f44336", fontWeight: "bold", marginTop: "10px" }}>
          Recording... {recordingTimeLeft}s left
        </p>
      )}
      {snapshotSaved && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
          ✅ Snapshot saved!
        </p>
      )}
      <p style={{ marginTop: "10px", color: "#555" }}>
        This stream is public. For mobile live feed, use your phone's IP camera app.
      </p>
    </div>
  );
};

export default English;
