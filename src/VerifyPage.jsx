import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }

      try {
        const tempRef = doc(db, "tempUsers", token);
        const tempSnap = await getDoc(tempRef);

        if (!tempSnap.exists()) {
          setStatus("This link has expired or is invalid.");
          return;
        }

        const userData = tempSnap.data();

        await setDoc(doc(db, "users", token), userData);
        await deleteDoc(tempRef);

        localStorage.setItem("userData", JSON.stringify(userData));
        setStatus("Email verified and registration completed!");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("Something went wrong.");
      }
    };

    verifyUser();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>{status}</h2>
    </div>
  );
}

export default VerifyPage;