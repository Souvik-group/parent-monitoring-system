import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Snapshot.css";

const CLOUD_NAME = "dwbyocbug";
const TAG = "snapshot";

const SnapshotVideoGallery = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaType, setMediaType] = useState("all"); // 'all', 'image', 'video'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest', 'oldest'

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [imgRes, vidRes] = await Promise.all([
          axios.get(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`),
          axios.get(`https://res.cloudinary.com/${CLOUD_NAME}/video/list/${TAG}.json`),
        ]);

        setImages(imgRes.data.resources);
        setVideos(vidRes.data.resources);
      } catch (error) {
        console.error("❌ Cloudinary fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const renderMediaItem = (item, type) => {
      const isImage = type === "image";
    
      const downloadUrl = isImage
        ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`
        : `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/fl_attachment/${item.public_id}.${item.format}`;
    
      const thumbnailUrl = isImage
        ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_300,h_200/${item.public_id}.${item.format}`
        : `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,du_1,f_jpg/${item.public_id}.jpg`;
    
      return (
        <div key={item.public_id} className="media-item-container">
          <div
            className="media-item"
            onClick={() => setSelectedItem({ ...item, type })}
          >
            <img
              src={thumbnailUrl}
              alt=""
              width="250"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/250x150?text=No+Preview";
              }}
            />
          </div>
          <p className="timestamp">{formatDate(item.created_at)}</p>
          <a href={downloadUrl} download={`snapshot-${item.created_at}.${item.format}`}>
            ⬇️ Download
          </a>
        </div>
      );
    };
    

  // Sort media based on sortOrder
  const sortedImages = [...images].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );

  const sortedVideos = [...videos].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <div className="gallery-wrapper">
      <h2>🖼️ Snapshot & Video Gallery</h2>

      {/* Filters */}
      <div className="filters">
        <label>
          📁 Media Type:{" "}
          <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          📅 Sort By:{" "}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Images Section */}
          {mediaType !== "video" && (
            <>
              <h3 style={{ marginTop: "30px" }}>🖼️ Images</h3>
              {sortedImages.length === 0 ? (
                <p>No images found.</p>
              ) : (
                <div className="media-grid">
                  {sortedImages.map((img) => renderMediaItem(img, "image"))}
                </div>
              )}
            </>
          )}

          {/* Videos Section */}
          {mediaType !== "image" && (
            <>
              <h3 style={{ marginTop: "40px" }}>🎥 Videos</h3>
              {sortedVideos.length === 0 ? (
                <p>No videos found.</p>
              ) : (
                <div className="media-grid">
                  {sortedVideos.map((vid) => renderMediaItem(vid, "video"))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <div className="lightbox-overlay" onClick={() => setSelectedItem(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === "image" ? (
              <img
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${selectedItem.public_id}.jpg`}
                alt=""
              />
            ) : (
              <video controls autoPlay>
                <source
                  src={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${selectedItem.public_id}.webm`}
                  type="video/webm"
                />
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapshotVideoGallery;
