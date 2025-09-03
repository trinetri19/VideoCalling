import './App.css'
import Landing from './pages/Landing'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Authentication/Register/Register';
import Login from './pages/Authentication/Login/Login';
import Meet from './pages/Meet';

function App() {
  return (
    <div className='main'>
  
    <BrowserRouter>
       <Routes>
           <Route path='/home' element={<Landing></Landing>}></Route>
           <Route path='/logout' element={<Landing></Landing>}></Route>
           <Route path='/register' element={<Register></Register>}></Route>
           <Route path='/login' element={<Login></Login>}></Route>
           <Route path='/:url' element={<Meet></Meet>}></Route>
       </Routes>
   </BrowserRouter>
  </div>
  )
}

export default App
