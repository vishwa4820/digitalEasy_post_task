/***********************************
    fileName    : user.js
    Description : mongodb table for user
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    name:{
        alias   : "Name",
        type    : String,
        require : true
    },
    email:{
        alias     : "Email",
        type      : String,
        require   : true,
        lowercase : true,
        unique    : true  
    },
    mobile:{
        alias     : "Mobile",
        type      : Number,
        require   : true,
        unique    : true 
    },
    password:{
        alias   : "Password",
        type    : String,
        require : true
    },
    role:{
        alias   : "Role",
        type    : mongoose.Types.ObjectId,
        require : true,
        default : null
    },
    isActive:{
        alias     : "Is Active",
        type      : Number,
        default   : 1    // i - ACTIVE USER, 0 - INACTIVE USER
    },
    createdAt:{
        alias   : "Created At",
        type    : Date,
        default : Date.now()
    },
    updatedAt:{
        alias   : "Updated At",
        type    : Date,
        default : null
    },
    deletedAt:{
        alias   : "Deleted At",
        type    : Date,
        default : null
    }
},{versionKey: false,retainKeyOrder: true});

const user_table = mongoose.model("user",user_schema);

// EXPORT TABLE
exports.get_db = function(){
    return user_table;
}