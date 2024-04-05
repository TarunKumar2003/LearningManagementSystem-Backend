import multer from "multer";
import path from "path"
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, "./public/temp")
//     },
//     filename:function(req,file,cb) {
//         cb(null, file.originalname)
//     }
// })
// export const upload = multer({
//     storage
// })

const upload = multer({
    dest:"uploads/",
    limits:{fileSize:50*1024*1024}, // 50mb in size max limit 
    storage:multer.diskStorage({
        destination:"uploads/",
        filename: (_req, file, cb)=>{
          cb(null,file.originalname);
        }
    }),
    fileFilter: (_req, file, cb)=>{
        let ext = path.extname(file.originalname);
        if(
           ext!==".jpg" && 
           ext!==".jpeg" && 
           ext!==".webp" && 
           ext!==".png" && 
           ext!==".mp4"
        ){
          cb(new Error(`Unsupported file type ${ext}`),false );
        }
        cb(null, true);
    },
}) 

export default upload;