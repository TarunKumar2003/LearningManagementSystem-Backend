import app from './app.js'
import connectDB from './config/dbConnection.js';
const PORT = process.env.PORT || 3000;

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