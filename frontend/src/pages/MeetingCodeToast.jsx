import React, { useState } from "react";
import Button from "./templates/Button"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MeetingCodeToast = ({ closeToast }) => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim()) {
      toast.error("Please enter a valid meeting code");
      return;
    }
    closeToast(); 
    navigate(`/VC/${code}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ padding: "5px", margin: "10px",width:"15rem" }}
      />
      <Button title="Join" onClick={handleJoin} />
    </div>
  );
};

export default MeetingCodeToast;
