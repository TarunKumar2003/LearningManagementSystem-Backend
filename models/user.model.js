
import mongoose from "mongoose";

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
        }
},{timestamps:true})


export const User = mongoose.model("User",userSchema);