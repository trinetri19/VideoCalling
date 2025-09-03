import { useState } from 'react'
import axios from 'axios'
import './login.css'
import Button from '../../templates/Button'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import server from '../../../../environtment'
const Loginform = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${server}/VC/login`, {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);

    toast.success("User Login successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    
    setTimeout(() => {
      navigate("/");
    }, 2000);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Login Failed. Try again.",
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
  }
};

    return (
        <div className='f'>
            <h1> Login</h1>
            <form onSubmit={handleSubmit} className="innerForm">
                <div className='inp'>
                    <label htmlFor="username" id="username" >Username</label>
                    <input type="text" name="username" placeholder='Enter Username' onChange={(e) => setUsername(e.target.value)}></input></div>
                <div className='inp'>
                    <label htmlFor="password" id="password" >Password</label>
                    <input placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <Button title="Login">Login</Button>
                <ToastContainer></ToastContainer>
                <p>Not An User? Then <Link to="/register">REGISTER!</Link> </p>
            </form>
        </div>
    )
}
export default Loginform;