/***********************************
    fileName    : user.js
    Description : Mother class for user related operations
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

module.exports = class user {
    #db = false;
    constructor(){
        try{
            // LOCAL MODULES
            this.#db        = require("../dbModels/user").get_db(); // ACCESS USER TABLE
            this.validation = require("../validation/user");
            // NPM
            this.bcrypt   = require("bcrypt");
            this.jwt      = require("jsonwebtoken");
            this.mongoose = require("mongoose");
        }catch(e){
            console.log(e)
        }
    }

     /*
        GENRATE HASH PASSWORD
            - this function used to genrate normal string to hashed string using bcrypt npm
     */
     genHashPwd = (pwd,callback) => {
        try{
            let saltRounds = 10;
            this.bcrypt.genSalt(saltRounds,(err1, salt) => {
                if(err1){
                    return callback({sts:false,code:500,msg:"Something went wrong",rslt:[],error:[]});
                }else{
                    this.bcrypt.hash(pwd, salt, (err2, hash) => {
                        if(err2){
                            return callback({sts:false,code:500,msg:"Something went wrong",rslt:[],error:[]});
                        }else{
                            return callback({sts:true,code:200,msg:"Password hashed successfully",rslt:hash,error:[]});
                        }
                    });
                }
            });
        }catch(e){
            return callback({sts:false,code:500,msg:"Unable to process your request",rslt:[],error:[]});
        }
    }

    /*
        COMAPRE HASH PASSWORD
            - this function used to compare normal string and hashed string using bcrypt npm and its return a boolean
     */
    compHashPwd = (pwd,hash,callback) => {
        try{
            this.bcrypt.compare(pwd, hash, function(err, result) {
                if(err){
                    return callback({sts:false,code:500,msg:"Something went wrong",rslt:[],error:[]});
                }else{
                    if(!result){
                        return callback({sts:false,code:400,msg:"Comparision failed",rslt:result,error:[]});
                    }else{
                        return callback({sts:true,code:200,msg:"Comparision success",rslt:result,error:[]});
                    }
                }
            });
        }catch(e){
            return callback({sts:false,code:500,msg:"Unable to process your request",rslt:[],error:[]});
        }
    }


    /*
        USER REGISTRATION METHOD
            - this function is used to register user details like name.mobile,email,password
            - this function validate mobile number and email id already exists because its unique. user used to login mobile number or email id
    */
    register = async(pro_info,callback) => {
        const data     = pro_info.body;
        const validate = await this.validation.register(data); // BASIC VALIDATION
        if(!validate.sts){
            return callback(validate);
        }else{
            const query = {$or:[{mobile:data.mobile},{email:new RegExp("^"+data.email.toLowerCase()+"$","i")}]}
            this.#db.findOne(query).then((is_exist) => {
                if(is_exist){ // CHECK MOBILE AND EMAIL ALREADY EXISTS
                    let err_msg = ""
                    if((is_exist.mobile.toString() === data.mobile.toString()) && (is_exist.email === data.email.toLowerCase())){
                        err_msg = "Mobile number & emailId already exists"
                    }else
                    if(is_exist.mobile.toString() === data.mobile.toString()){
                        err_msg = "Mobile number already exists"
                    }else
                    if(is_exist.email === data.email.toLowerCase()){
                        err_msg = "EmailId already exists"
                    }
                    return callback({sts:false,code:409,msg:err_msg,rslt:[],error:[]});
                }else{
                    this.genHashPwd(data.password,(pwd_rslt)=>{ // FUNCTION FOR HASHING PASSWORD
                        if(!pwd_rslt.sts){
                            return callback(pwd_rslt);
                        }else{
                            data.password = pwd_rslt.rslt;
                            this.#db.create(data).then(ins_rslt => { // USER INSERT PROCESS
                                delete ins_rslt._doc.password;
                                return callback({sts:true,code:200,msg:"User created successfully !!!",rslt:ins_rslt,error:[]});
                            }).catch(err =>{
                                return callback({sts:false,code:500,msg:"Unable to register",rslt:[],error:[]});
                            })
                        }
                    });
                }
            }).catch((e) => {
                return callback({sts:false,code:500,msg:"Unable to process",rslt:[],error:[]});
            });
        }
    }


    /*
        USER LOGIN METHOD
            - login through mobile number or email id
            - if user successfully logedin. this function return JWT bearer token with expire time and some user information
    */
    login = async(pro_info,callback) => {
        const data     = pro_info.body;
        const validate = await this.validation.login(data); // BASIC VALIDATION
        if(!validate.sts){
            return callback(validate);
        }else{
            const query = [{email:new RegExp("^"+ data["mob-email"].toLowerCase() +"$","i")}];
            if(!isNaN(data["mob-email"])){
                query.push({mobile:data["mob-email"]});
            }
            this.#db.findOne({$or:query}).lean().then((is_exist) => {
                if(!is_exist){
                    return callback({sts:false,code:400,msg:"User not found",rslt:[],error:[]});
                }else{
                    this.compHashPwd(data.password,is_exist.password,async(comp_rslt)=>{ // COMPARE PASWORD
                        if(!comp_rslt.sts){
                            return callback({sts:false,code:500,msg:"Incorrect password",rslt:[],error:[]});
                        }else{
                            let token = await this.jwt.sign({userId:is_exist._id,role:is_exist.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE}); // GENRATE JWT TOKEN
                            return callback({sts:true,code:200,msg:"Login successfully",rslt:{token},error:[]});
                        }
                    });
                }
            }).catch((e) => {
                console.log(e)
                return callback({sts:false,code:500,msg:"Unable to process",rslt:[],error:[]});
            });
        }
    }

    // GET ROLES
    get_role = (pro_info,callback) => {
        this.mongoose.connection.db.collection("roles").find({}).project({_id:false,label:"$role",value:"$_id"}).toArray().then((role_rslt)=>{
            role_rslt.unshift({isDisable:true,lable:"----- Select Role -----"})
            return callback({sts:true,code:200,msg:"List of roles",rslt:role_rslt,error:[]});
        })
    }
}