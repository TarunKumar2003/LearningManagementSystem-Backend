import jwt from "jsonwebtoken";


export default async function isLoggedIn(req, res, next){
     // Take token from cookie
     const { token } = req.cookies;

     if(!token){
        return next(new ApiError(401,"Unauthenticated , please login"))
     }

     const userDetails = await jwt.verify(token,process.env.JWT_SECRET);
     req.user = userDetails;
     next();

}