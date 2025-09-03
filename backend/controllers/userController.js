import { User } from "../models/userModel.js";
import httpStatus from 'http-status'
import bcrypt , { hash} from 'bcrypt'
import crypto from 'crypto'

const register = async (req,res) =>{
    const {username,email,password} = req.body;
    try{
       const existingUser = await  User.findOne({username})
       if(existingUser){
        return res.status(httpStatus.FOUND).json({message:"User already exists "});
       }
       const hashedPassword = await bcrypt.hash(password,8);
       const newUser = new User({
        username:username,
        email:email,
        password: hashedPassword
       })
       await newUser.save();
       res.status(httpStatus.CREATED).json({message:`User Registerd`});
    }catch(e){
       res.json({message:`Something went wrong ${e}`})
    }

}

const login = async  (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
         return res.status(400).json({message:`Please Provide `})
    }
    try{
      const user = await User.findOne({username})
      if(!user){
        return res.status(httpStatus.NOT_FOUND).json({message:`User Not found`})
      }
      if(bcrypt.compare(password,user.password)){
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
         await user.save();
         return res.status(httpStatus.OK).json({token : token });
      }
    }catch(e){
        return res.json({message:`Something went wrong ${e}`})
    }
}
const logout = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Please provide username" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        user.token = null;
        await user.save();

        return res.status(httpStatus.OK).json({ message: "User logged out successfully" });
    } catch (e) {
        return res.json({ message: `Something went wrong ${e}` });
    }
};
const getUser = async (req,res) =>{
  const user  = await  User.find();
  return res.json(user);
}

export { login, register,logout,getUser};