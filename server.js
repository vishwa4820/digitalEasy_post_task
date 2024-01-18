/***********************************
    fileName     : server.js
    Description : Entry ponit of the entire project
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

// INCLUDE PACKAGE
require("dotenv").config();               // for .env files
const express    = require("express");
const mongoose   = require("mongoose");
const fileUpload = require("express-fileupload");
const fs         = require("fs");
const app        = express();             // create express app

//MONGODB CONNECTION USING MONGOOSE
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log("mongoDB connected successfully");
});

// INCLUDE LOCAL MODULES
const passport = require("./src/config/passport");

// MIDDLE-WARE FUNCTIONS
app.use(express.json());
app.use(checkFile,express.static("./"));
app.use(passport.initialize());
app.use(fileUpload())

// ROUTES
app.use("/api/user",    require("./src/routes/user")(express));
app.use("/api/post",    jwt_auth,require("./src/routes/post")(express));   // PROTECTED ROUTE


const port = process.env.PROT || 5000;
app.listen(port,()=> console.log(`Server running on port ${port}`));

// VALIDATE JWT AUTH
function jwt_auth(req,res,next){
  passport.authenticate('jwt_auth', { session: false },(err, user, info) => {
      if(err){
        return res.status(err.code).json(err);
      }else
      if(info){
        return res.status(400).json({sts:false,code:400,msg:info.message,rslt:[],error:[],redirect:"/login"});
      }else{
        if(!user.sts){
          return res.status(user.code).json(user);
        }else{
          next();
        }
      }
    })(req, res, next)
}


// CHECK FILE EXISTS AND ONLY ALLOW TO SHOW IMAGES NOT SHOW JS FILES
function checkFile(req,res,next){
  try{
    const allow_ext = ["png","jpeg","jpg"];
    if(fs.existsSync("." + req.url)){
      const ext = req.url.split(".").pop();
      if(!allow_ext.includes(ext)){
        return res.status(400).json({sts:false,code:400,msg:"Invalid request",rslt:[],error:[]});
      }else{
        next();
      }
    }else{
      next();
    }
  }catch(e){
    return res.status(500).json({sts:false,code:500,msg:"Interal Server Error",rslt:[],error:[]});
  }
}