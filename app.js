import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
config();

const app = express();


// configure middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// third party middleware
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/ping',(req,res)=>{
    res.send('pong');
})

app.use('./api/v1/user',userRouter);

app.all('*',(req,res)=>{
    res.status(404).send("OOPS !! 404 Page not found");
})

app.use(errorMiddleware);

export default app;