/***********************************
    fileName    : passport.js
    Description : for authenticate user
    Author      : Vishwa
    createdAt   : 10JAN2024
************************************/ 
// NPM
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt  = require('passport-jwt').ExtractJwt;
let passport    = require('passport');
let userDB      = require("../dbModels/user").get_db();

let options     = {
    jwtFromRequest    : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey       : process.env.JWT_SECRET,
    passReqToCallback : true
    
}
// PASSPORT AUTH
passport.use("jwt_auth",new JwtStrategy(options, function(req,jwt_payload, done){
    try{
        userDB.findOne({_id:jwt_payload.userId}).lean().then((user)=>{
            if(!user){
                let message = {sts:false,code:400,msg:"Invalid User",rslt:[],error:[],redirect:"/login"}
                done(false,message,false)
            }else
            if(user.isActive === 0){
                let message = {sts:false,code:400,msg:"Your are not a active user",rslt:[],error:[],redirect:"/login"}
                done(false,message,false)
            }else{
                let message = {sts:true,code:202,msg:"Auth sucess",rslt:[],error:[],redirect:""}
                req.body.userId = jwt_payload.userId;
                req.body.isUser  = (jwt_payload.role === "65a0fee5e284344ecdf5b4e5") ? true : false;  // CHECK USER OR ADMIN
                done(false,message,false)
            }
        }).catch(e =>{
            console.log(e)
            let error = {sts:false,code:500,msg:"Internal Server Error",rslt:[],error:[],redirect:"/login"}
            done(error,false,false)
        })
    }catch(err){
        let error = {sts:false,code:500,msg:"Internal Server Error",rslt:[],error:[],redirect:"/login"}
        done(error,false,false)
    }
}));

module.exports = passport;
