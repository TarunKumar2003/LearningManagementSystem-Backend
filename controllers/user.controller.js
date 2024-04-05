import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import cloudinary from "cloudinary";
import fs from "fs"
const cookieOptions = {
     maxAge:7*24*60*60*1000, // 7 Days
     httpOnly:true
}
export const register = async (req, res, next)=>{
   const {fullName, email, password} = req.body;
   if(!fullName || !email || !password){
      return next(new ApiError(400,"All Fields are compulsory"));
   }
   const userExist = User.findOne({ email });
   if(userExist){
    return next(new ApiError(400,"Email already register or exist "));
   }

   const user = await User.create({
      fullName,
      password,
      email,
      avatar:{
         public_id:email,
         secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
      }
   })

   if(!user){
      return next(new ApiError("user registration failed, Please try again Later ",400));
   }
   // TODO: File Upload
     // Upload file on cloudnary 
     if(req.file){ // if req k ander file hai to 
        console.log(req.file);
            try {
               const result = await cloudinary.v2.uploader.upload(req.file.path, {
                  folder:'lms',
                  width:250,
                  height:250,
                  gravity:'faces',
                  crop:'fill'
               })
               if(result){
                  user.avatar.public_id = (await result).public_id;
                  user.avatar.secure_url = result.secure_url;

                  // Remove file from server  
                  fs.rm(`uploads/${req.file.filename}`)
               }
            } catch (error) {
                return next( new ApiError(error || 'File not uploaded please try again'));
            }
     }
   await user.save();

   user.password = undefined;
   const token = await user.generateJWTToken();
   res.cookie('token',token,cookieOptions);
   res.status(201).json({
       success:true,
       message:"User registered Successfully ",
       user
   })
}

export const login = async (req, res, next)=>{
   try {
       const { email, password} = req.body;
       if(!email || !password){
         return next(new ApiError(400,"All Fields are reuired"))
       }
       
       const user = await User.findOne({ email }).select("+password");
   
       // check if user exist or not and match the typed password with the password saved in the database 
       if(!user || !user.comparePassword(password)){
         next(new ApiError(400,"Email or password does not match"))
       }
       
       const token = await user.generateJWTToken();
       user.password = undefined;
       res.cookie('token', token, cookieOptions);
   
       res.status(200).json({
         success:true,
         message:"User logged in successfully ",
         user,
       })
   
   } catch (error) {
       return next(new ApiError(500,error.message));
   }


}

export const logout = (req, res)=>{
       // Simply logout karna hai to cookie reset kar do 
       res.cookie("token",null,{
         secure:true,
         maxAge:0,
         httpOnly:true
       })

       res.status(200).json({
         success:true,
         message:"user loggedOut Successfully "
       })
}

export const  getProfile = async (req, res, next)=>{
      // If User is see your detail it must be logged in
    try {
        const user = await User.findById(req.user.id);
  
        res.status(200).json({
           success:true,
           message:"User details",
           user,
        });
    } catch (error) {
         return next(new ApiError(500,"Failed to fetched user details"))
    }

}