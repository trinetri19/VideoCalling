import { useState } from 'react'
import axios from 'axios'
import Button from '../../templates/Button'
import './register.css'
import { Link ,useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import server from '../../../../environtment';

 const RegisterForm = () => {
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${server}/VC/register`, {
      email,
      username,
      password,
    });

    
    localStorage.setItem("token", res.data.token);

   
    toast.success("User registered successfully!", {
      position: "top-center",
      autoClose: 2000, 
    });

   
    setTimeout(() => {
      navigate("/VC/home");
    }, 2000);

  } catch (error) {
    console.error(error);

    // handle server error with toast
    toast.error(
      error.response?.data?.message || "Registration failed. Try again.",
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
  }
};
    return (
        <div className='R'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className='innerRForm'>
                <div className='inp'>
                    <label htmlFor="email" id="email" >Email</label>
                    <input type="text" name="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className='inp'>
                    <label htmlFor="username" id="username" >Username</label>
                    <input type="text" name="username" placeholder='Enter Username' onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className='inp'>
                    <label htmlFor="password" id="password" >Password</label>
                    <input placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <Button title="register"></Button>
                 <ToastContainer />
            </form>
            <p>Already An User? Then <Link to="/VC/login">Login here!</Link> </p>
            
        </div>
    )
}
export default RegisterForm;