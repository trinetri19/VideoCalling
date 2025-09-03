import './App.css'
import Landing from './pages/Landing'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './pages/templates/Navbar';
import Register from './pages/Authentication/Register/Register';
import Login from './pages/Authentication/Login/Login';
import Meet from './pages/Meet';

function App() {
  return (
    <div className='main'>
  
    <BrowserRouter>
       <Routes>
           <Route path='/VC/home' element={<Landing></Landing>}></Route>
           <Route path='/VC/logout' element={<Landing></Landing>}></Route>
           <Route path='/VC/register' element={<Register></Register>}></Route>
           <Route path='/VC/login' element={<Login></Login>}></Route>
           <Route path='/VC/:url' element={<Meet></Meet>}></Route>
       </Routes>
   </BrowserRouter>
  </div>
  )
}

export default App
