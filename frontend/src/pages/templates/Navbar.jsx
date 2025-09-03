import React ,{useState , useEffect} from "react";
import Button from "./Button";
import axios from 'axios'
import './nav.css'
import { Link ,useNavigate} from "react-router-dom";
const Navbar = () => {

  const navigate = useNavigate();



  let handleLogout= ()=>{
    navigate("/VC/login");
  }
    return (
        <div className="nav">
            <div className="nav-left">
                <h1>Video Calling</h1>
            </div>
            <div className="nav-right">
                
                 <Link>
                    <Button title="logout" onClick={handleLogout}></Button>
                </Link>  <Link to="/VC/register">
                    <Button title="Register"></Button>
                </Link>
                
                 
            </div>
        </div>)
}
export default Navbar;