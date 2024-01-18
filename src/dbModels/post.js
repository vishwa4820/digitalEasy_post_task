/***********************************
    fileName    : post.js
    Description : mongodb table for post
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

const mongoose = require("mongoose");

const post_schema = new mongoose.Schema({
    userId:{
        alias   : "User Id",
        type    : mongoose.Types.ObjectId,
        require : true,
        default : null
    },
    title:{
        alias   : "Title",
        type    : String,
        require : true
    },
    description:{
        alias   : "Description",
        type    : String,
        require : true
    },
    image:{
        alias   : "Image",
        type    : String,
        require : true
    },
    isPrivate:{
        alias   : "Is Private",
        type    : Boolean,
        default : false  // true - PRIVITE POST , false - PUBLIC POST
    },
    status:{
        alias     : "Status",
        type      : Number,
        default   : 1    // 1 - ACTIVE POST, 0 - DELETED POST
    },
    postedDate:{
        alias   : "Posted Date",
        type    : Date,
        default : Date.now()
    },
    postedBy:{
        alias   : "Posted By",
        type    : mongoose.Types.ObjectId,
        default : null
    },
    updatedDate:{
        alias   : "Updated Date",
        type    : Date,
        default : null
    },
    updatedBy:{
        alias   : "Updated By",
        type    : mongoose.Types.ObjectId,
        default : null
    },
    deletedDate:{
        alias   : "Deleted Date",
        type    : Date,
        default : null
    },
    deletedBy:{
        alias   : "Deleted By",
        type    : mongoose.Types.ObjectId,
        default : null
    }
},{versionKey: false,retainKeyOrder: true});

const post_table = mongoose.model("post",post_schema);

// EXPORT TABLE
exports.get_db = function(){
    return post_table;
}