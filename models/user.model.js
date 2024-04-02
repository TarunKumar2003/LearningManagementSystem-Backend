import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [5, 'Name must be at least 5 characters'],
            lowercase: true,
            trim: true, // Removes unnecessary spaces
          },
          email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              'Please fill in a valid email address',
            ], // Matches email against regex
          },
          password:{
            type:String,
            required:[true, "password must be required"],
            minLength:[8,"Password must be atleast 8 characters"],
            select:false, // this field for we are selecting the user password field not selected all time 
          },
            avatar:{
                public_id:{
                    type:String,
                },
                secure_url:{
                    type:String
                }
            },
            forgotPassword:{
                type:String
            },
            forgotPasswordExpiry:{
              type:Date 
            },
            role:{
                type:String,
                enum:["ADMIN","USER"], // Possible values for role,
                default:"USER"
            }
},{timestamps:true})


userSchema.pre('save',async (next)=>{
    if(!this.isModified('password')){
      return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.generateJWTToken = function(){
       return jwt.sign({
                _id:this._id,
                email:this.email,
                role:this.role,
                subscription:this.subscription
       },
       process.env.JWT_SECRET,
       {
        expiresIn:process.env.JWT_EXPIRY
       }
     )
}
userSchema.methods.comparePassword = async function(plainTextPassword){
       return await bcrypt.compare(plainTextPassword, this.password); 
}




export const User = mongoose.model("User",userSchema);