import React, { useRef, useState } from "react";
import "./Contact.css";
import emailjs from "emailjs-com";

const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";
const CLOUDINARY_CLOUD_NAME = "dwbyocbug";

const Contact = () => {
  const form = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = (err) => reject(err);
        img.src = event.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const uploadToCloudinary = async (fileBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", fileBlob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Cloudinary upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      throw err;
    }
  };

  const sendQuery = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let imageUrl = "";

    try {
      if (selectedFile) {
        const resizedImageBlob = await resizeImage(selectedFile, 800, 800);
        imageUrl = await uploadToCloudinary(resizedImageBlob);
        console.log("Uploaded to Cloudinary:", imageUrl);
      }

      const formData = new FormData(form.current);

      await emailjs.send(
        "service_ku4ishl",
        "template_7mt08rh",
        {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          image: imageUrl || "No image uploaded", // Ensure the image URL is passed
        },
        "lrsQhzzTNFGumuYzV"
      );

      alert("Query sent successfully!");
      form.current.reset();
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to send message or upload image. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-form">
        <h2>GET IN TOUCH</h2>
        <h3>We're here to help you!</h3>
        <form ref={form} onSubmit={sendQuery}>
          <label htmlFor="name">Name *</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email address *</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="phone">Phone number *</label>
          <input type="tel" id="phone" name="phone" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4"></textarea>

          <label htmlFor="file">Upload an Image (optional)</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          {isUploading && <p>Processing...</p>}

          <div className="checkbox-group">
            <input type="checkbox" id="consent" name="consent" required />
            <label htmlFor="consent">
              I allow this website to store my submission so they can respond to my inquiry. *
            </label>
          </div>

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Processing..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
