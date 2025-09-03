import express from "express"
import mongoose from "mongoose"
import {Server} from "socket.io"
import userRoutes from "./routes/userRoutes.js";
import 'dotenv/config'

import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/VC/',userRoutes);




const main = async ()=>{
    await mongoose.connect(process.env.mongoUrl)
}

main().then((res)=>{ console.log(`db connect`)}).catch((err)=>{console.log(err)})

  
export default app;