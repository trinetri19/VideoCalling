import React from "react";
import "./Landing.css";
import Navbar from "./templates/Navbar";
import Footer from "./templates/Footer";
import Button from "./templates/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MeetingCodeToast from "./MeetingCodeToast"; // import

const Landing = () => {
  const handleGetStarted = () => {
    console.log(`hello`)

    toast.info(<MeetingCodeToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
  };

  return (
    <div className="landingContainer">
      <Navbar />
      <div className="lan-main">
        <div className="right-lan"></div>
        <div className="left-lan">
          <h1>
            <span>Connect</span> with Your
            <br />
            Loved Ones.
          </h1>
          <p>Cover a distance by video calling website.</p>

          <Button
            title="Get Started"
            className="lan-btn"
            onClick={handleGetStarted}
          />
          {/* Toast container must exist */}
          <ToastContainer />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
