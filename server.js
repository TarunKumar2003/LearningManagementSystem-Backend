import app from './app.js'
import connectDB from './config/dbConnection.js';
import cloudinary from "cloudinary";
const PORT = process.env.PORT || 3000;

// cloudinary cofiguration 
cloudinary.v2.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret:CLOUDINARY_API_SECRET,
  });

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is Started at port ${PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection Error !!!",err)
})
// app.listen(PORT,()=>{
//     console.log(`Server is listening on the port ${PORT}`)
// })