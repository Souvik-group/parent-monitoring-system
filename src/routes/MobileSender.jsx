import React, { useEffect, useState } from "react";

const CLOUD_NAME = "dwbyocbug"; // your cloud name
const UPLOAD_PRESET = "unsigned_preset"; // your upload preset

const fetchMedia = async (resourceType = "image") => {
  const res = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/list/${UPLOAD_PRESET}.json`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch ${resourceType}s: ${res.statusText}`);
  }
  const data = await res.json();
  return data.resources;
};

const SnapshotVideoGallery = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        const [imgList, vidList] = await Promise.all([
          fetchMedia("image"),
          fetchMedia("video"),
        ]);
        setImages(imgList);
        setVideos(vidList);
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🖼️🎥 Gallery</h2>
      {loading ? (
        <p>Loading media...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {images.map((img) => (
            <img
              key={img.public_id}
              src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.jpg`}
              alt={img.public_id}
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
          ))}
          {videos.map((vid) => (
            <video
              key={vid.public_id}
              src={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${vid.public_id}.webm`}
              controls
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SnapshotVideoGallery;
