import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore"; // Import Firestore functions
import { db } from "./firebase"; // Firestore instance
import { db1 } from "./firebase2";
import emailjs from "emailjs-com"; // Import emailjs
import Navbar from "./Components/Nevbar";
import About from "./Components/pages/About";
import Hero from "./Components/pages/Hero";
import Contact from "./Components/pages/Contact";
import Services from "./Components/pages/Services";
import LearnMore from "./Components/pages/LearnMore";
import HolidayBoard from "./Components/pages/HolidayBoard";
import SnapshotVideoGallery from "./routes/SnapshotVideoGallery";
import Dept from "./Components/pages/Dept";
import ProfileIcon from "./ProfileIcon";
import Bca from "./Depertment/Bca";
import English from "./Depertment/English";
import Bengali from "./Depertment/Bengali";
import Botany from "./Depertment/Botany";
import Chemistry from "./Depertment/Chemistry";
import Education from "./Depertment/Education";
import Geography from "./Depertment/Geography";
import History from "./Depertment/History";
import Philosophy from "./Depertment/Philosophy";
import Sanskrit from "./Depertment/Sanskrit";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

import "./App.css";

function HomePage({ userData, onLogout }) {
  return (
    <div className="homepage-container">
      <Navbar />
      {userData && <ProfileIcon user={userData} onLogout={onLogout} />}
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}

function App() {
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formState, setFormState] = useState({
    Parent_Name: "", // Added Parent_Name field
    Student_ID: "",
    name: "",
    password: "", // Added password field
  });
  const [emailError, setEmailError] = useState(""); // State for email error message
  const [isRegisterMode, setIsRegisterMode] = useState(true); // Toggle between Register and Login modes
  const [loginError, setLoginError] = useState(""); // State for login error message
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to show success modal

  // OTP-related states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);

  const handleOpenPopup = useCallback(() => {
    if (isRegisterMode) {
      setFormState({
        Parent_Name: "",
        Student_ID: "",
        name: "",
        password: "",
      }); // Reset formState for registration
      setEmail(""); // Reset email
      setOtp(""); // Reset OTP
      setGeneratedOtp(""); // Reset generated OTP
      setEmailVerified(false); // Reset email verification status
      setOtpFieldVisible(false); // Hide OTP field
      setEmailError(""); // Clear email error
    }
    setLoginError(""); // Always clear login error
    setShowPopup(true); // Show popup
  }, [isRegisterMode]);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      setTimeout(() => {
        handleOpenPopup(); // Use the memoized function to reset and open the popup
      }, 2000);
    }
  }, [handleOpenPopup]);

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter email first");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpFieldVisible(true);

    const templateParams = {
      to_email: email,
      name: formState.name || "User",
      message: newOtp,
    };

    emailjs
      .send(
        "service_lerycao", // Service ID
        "template_o4g2bat", // Template ID
        templateParams,
        "GsotktLCCONOC_HDe" // Public Key
      )
      .then((response) => {
        console.log("OTP email sent successfully", response.status, response.text);
        alert("OTP sent to your email");
      })
      .catch((err) => {
        console.error("Failed to send OTP email", err);
        alert("Failed to send OTP. Please try again.");
      });
  };

  useEffect(() => {
    if (otp && otp === generatedOtp) {
      setEmailVerified(true);
      console.log("Email verified!");
    }
  }, [otp, generatedOtp]);

  const handleEmailChange = async (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setEmailError(""); // Clear previous error message

    if (enteredEmail.trim() === "") return;

    try {
      const q = query(collection(db, "users"), where("email", "==", enteredEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setEmailError("This email is already registered. Please use a different email.");
        setEmail(""); // Clear the email field
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailError("Failed to check email. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    handleOpenPopup(); // Reset values and open the popup
  };

  const fetchStudentName = async () => {
    if (formState.Student_ID.trim() === "") return;

    try {
      const docRef = doc(db1, "users", formState.Student_ID); // Fetch from "users" collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormState((prev) => ({
          ...prev,
          name: docSnap.data().fullName || docSnap.data().name || "", // Use 'fullName' or fallback to 'name'
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          name: "", // Clear name if Student ID not found
        }));
        console.log("Student ID not found");
      }
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const handleRegister = async (formData) => {
    try {
      // Check if the email is already registered
      const q = query(collection(db, "users"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      // Add user to Firestore
      await addDoc(collection(db, "users"), formData);
      localStorage.setItem("userData", JSON.stringify(formData));
      setUserData(formData);
      setShowPopup(false);
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogin = async (formData) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoginError("Invalid email or password.");
        return;
      }

      let userFound = false;
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.password === formData.password) {
          userFound = true;
          localStorage.setItem("userData", JSON.stringify(user));
          setUserData(user);
        }
      });

      if (userFound) {
        setShowPopup(false);
        setLoginError(""); // Clear error message on successful login
      } else {
        setLoginError("Invalid email or password."); // Set error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className={showPopup ? "blur-background" : ""}>
              <HomePage userData={userData} onLogout={handleLogout} />
            </div>
          }
        />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/Holiday-Board" element={<HolidayBoard />} />
        <Route path="/activity" element={<Dept />} />
        <Route path="/image" element={<SnapshotVideoGallery />} />
        <Route path="/department/bca" element={<Bca />} />
        <Route path="/department/English" element={<English />} />
        <Route path="/department/Bengali" element={<Bengali />} />
        <Route path="/department/Botany" element={<Botany />} />
        <Route path="/department/Chemistry" element={<Chemistry />} />
        <Route path="/department/Education" element={<Education />} />
        <Route path="/department/Geography" element={<Geography />} />
        <Route path="/department/History" element={<History />} />
        <Route path="/department/Philosophy" element={<Philosophy />} />
        <Route path="/department/Sanskrit" element={<Sanskrit />} />
      </Routes>

      {/* Popup for Registration/Login */}
      {showPopup && (
        <div className="popup">
          <h2>{isRegisterMode ? "Register" : "Login"}</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = isRegisterMode
                ? {
                    Parent_Name: formState.Parent_Name, // Include Parent_Name in formData
                    name: formState.name || "",
                    email: email,
                    Student_ID: formState.Student_ID,
                    password: formState.password,
                  }
                : {
                    email: email,
                    password: formState.password,
                  };

              if (isRegisterMode) {
                handleRegister(formData);
              } else {
                handleLogin(formData);
              }
            }}
          >
            {isRegisterMode ? (
              <>
                <label>
                  Parent Name:
                  <input
                    type="text"
                    name="Parent_Name"
                    value={formState.Parent_Name}
                    onChange={(e) =>
                      setFormState({ ...formState, Parent_Name: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Student ID:
                  <input
                    type="text"
                    name="Student_ID"
                    value={formState.Student_ID}
                    onChange={(e) =>
                      setFormState({ ...formState, Student_ID: e.target.value })
                    }
                    onBlur={fetchStudentName} // Trigger fetchStudentName on blur
                    required
                  />
                </label>
                <label>
                  Name:
                  <input type="text" name="name" value={formState.name} readOnly />
                </label>
                <label>
                  Email:
                  <div className="email-otp-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className={`send-otp-btn ${emailVerified ? "verified" : ""}`}
                      disabled={emailVerified}
                    >
                      {emailVerified ? "Verified ✅" : "Send OTP"}
                    </button>
                  </div>
                </label>
                {emailError && <p className="error-text">{emailError}</p>}
                {otpFieldVisible && !emailVerified && (
                  <label>
                    Enter OTP:
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </label>
                )}
                <label>
                  Password:
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formState.password}
                      onChange={(e) =>
                        setFormState({ ...formState, password: e.target.value })
                      }
                      required
                    />
                    <span
                      className="toggle-password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </label>
              </>
            ) : (
              <>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Password:
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formState.password}
                      onChange={(e) =>
                        setFormState({ ...formState, password: e.target.value })
                      }
                      required
                    />
                    <span
                      className="toggle-password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </label>
              </>
            )}
            {loginError && <p className="error-text">{loginError}</p>} {/* Display error message */}
            <button type="submit">{isRegisterMode ? "Register" : "Login"}</button>
          </form>
          <p className="login-toggle">
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                handleOpenPopup(); // Reset form when toggling between Register/Login
              }}
            >
              {isRegisterMode ? "Login" : "Register"}
            </button>
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>🎉 Registration Successful!</h2>
            <p>Welcome to our platform! You can now explore the features and services we offer.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="success-modal-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;