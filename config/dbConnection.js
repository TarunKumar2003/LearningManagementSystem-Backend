import mongoose from "mongoose";

const connectDB = async  ()=>{
     try {
        const connectionInstance = mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`\n MONGODB connected Successfully !! DB HOST : ${(await connectionInstance).connection.host}`);
     } catch (error) {
        console.error(" mongodb connection error",error);
        process.exit(1);
     }
}
export default connectDB;