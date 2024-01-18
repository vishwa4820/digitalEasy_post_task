/***********************************
    fileName    : user.js
    Description : Basic validation for user
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 
const isEmpty   = require("is-empty");
const validator = require("validator");
const mongoose  = require("mongoose");

// USER REGISTER VALIDATION
exports.register = (pro_info) => {
    const error = {};
    // NAME
    pro_info.name = !isEmpty(pro_info.name) ? pro_info.name : "";
    if(validator.isEmpty(pro_info.name)){
        error.name = "Please enter your name"
    }
    // EMAIL
    pro_info.email = !isEmpty(pro_info.email) ? pro_info.email : "";
    if(validator.isEmpty(pro_info.email)){
        error.email = "Please enter your email";
    }else{
        var email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(!email_reg.test(pro_info.email)){
            error.email = "Please provide valid email";
        }
    }
    // MOBILE
    pro_info.mobile = !isEmpty(pro_info.mobile) ? pro_info.mobile : "";
    pro_info.mobile = pro_info.mobile.toString();
    if(validator.isEmpty(pro_info.mobile)){
        error.mobile = "Please enter your mobile";
    }else
    if(isNaN(pro_info.mobile)){
        error.mobile = "Please enter valid mobile number";
    }else
    if(!validator.isLength(pro_info.mobile,{min:10,max:10})){
        error.mobile = "Please enter 10 digit of your mobile number";
    }
    // PASSWORD
    pro_info.password = !isEmpty(pro_info.password) ? pro_info.password : "";
    if(validator.isEmpty(pro_info.password)){
        error.password = "Please enter your password";
    }else
    if(!validator.isLength(pro_info.password,{min:8})){
        error.password = "Please enter atleast 8 character of your password";
    }
    // ROLE
    pro_info.role = !isEmpty(pro_info.role) ? pro_info.role : "";
    if(validator.isEmpty(pro_info.role)){
        error.role = "Please select role"
    }else
    if(!mongoose.isValidObjectId(pro_info.role)){
        error.role = "Please provide valid role format"
    }

    if(isEmpty(error)){
        return {sts:true,code:200,msg:"Validation success",rslt:[],error:[]}
    }else{
        return {sts:false,code:400,msg:"Validation fail",rslt:[],error:error}
    }
}

// USER LOGIN VALIDATION
exports.login = (pro_info) => {
    const error = {};
    // MOB EMAIL
    pro_info["mob-email"] = !isEmpty(pro_info["mob-email"]) ? pro_info["mob-email"] : "";
    pro_info["mob-email"] = pro_info["mob-email"].toString();
    if(validator.isEmpty(pro_info["mob-email"])){
        error["mob-email"] = "Please enter your mobile number or email"
    }
    // PASSWORD
    pro_info.password = !isEmpty(pro_info.password) ? pro_info.password : "";
    if(validator.isEmpty(pro_info.password)){
        error.password = "Please enter your password";
    }else
    if(!validator.isLength(pro_info.password,{min:8})){
        error.password = "Password must contain 8 character and above";
    }

    if(isEmpty(error)){
        return {sts:true,code:200,msg:"Validation success",rslt:[],error:[]}
    }else{
        return {sts:false,code:400,msg:"Validation fail",rslt:[],error:error}
    }
}