import React from "react";
import RegisterForm from "./RegisterForm";
import './register.css';

const Register = () => {
   return (
      <div className="mainRegisterDiv">
         <div className="imageRegister"></div>
         <div className="RegisterForm"><RegisterForm></RegisterForm></div>
      </div>
   )
}
export default Register;