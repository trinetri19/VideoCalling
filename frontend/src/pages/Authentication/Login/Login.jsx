import React from "react";
import Loginform from "./LoginForm";
import './login.css'
const Login = () => {
    return (
        <div className="mainLoginDiv">
            <div className="imageLogin"></div>
            <div className="LoginForm"><Loginform></Loginform></div>
        </div>
    )
}
export default Login;