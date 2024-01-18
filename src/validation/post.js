/***********************************
    fileName    : post.js
    Description : Basic validation for post
    Author      : Vishwa
    createdAt   : 13JAN2024
************************************/ 
const isEmpty   = require("is-empty");
const validator = require("validator");

// CREATE POST VALIDATION
exports.create_edit_post = (data,files) => {
    const error = {};
    // TITLE
    data.title = !isEmpty(data.title) ? data.title : "";
    if(validator.isEmpty(data.title)){
        error.title = "Please enter post title"
    }
    // DESCRIPTION
    data.description = !isEmpty(data.description) ? data.description : "";
    if(validator.isEmpty(data.description)){
        error.description = "Please enter post description"
    }
    // IMAGE 
    let allow_format = {"png":true,"jpg":true,"jpeg":true}
    let limit_size  = 2 * 1024 * 1024 // 2 MB
    if(!files || !files.uploadFile){
        error.uploadFile = "Please upload image"
    }else // SIZE VALIDATION
    if(files.uploadFile.size > limit_size){
        error.uploadFile = "Please upload image below 2mb"
    }else{ // EXTENSION VALIDATION
        let ext = files.uploadFile.name.split(".").pop().toLowerCase();
        if(!allow_format[ext]){
            error.uploadFile = "Please upload image in .png,.jpg,.jpeg format only"
        }
        files.uploadFile.ext = ext //  SET EXT NAME TO FILES INFORMATION
    }
    // IS PRIVATE
    if(data.isPrivate){
        var format = ["true","false"];
        if(!format.includes(data.isPrivate)){
            error.isPrivate = "Please provide true or false"
        }
    }

    if(data.mode && data.mode === "edit"){ // FOR EDIT
        // POST ID
        data.postId = !isEmpty(data.postId) ? data.postId : "";
        if(validator.isEmpty(data.postId)){
            error.postId = "Please enter post postId"
        }
    }

    if(isEmpty(error)){
        return {sts:true,code:200,msg:"Validation success",rslt:[],error:[]}
    }else{
        return {sts:false,code:400,msg:"Validation fail",rslt:[],error:error}
    }
}

// READ POST VALIDATION
exports.read_post = (data) => {
    const error = {};
    // FILTER By USER
    if(data.filterByUser){
        if(!Array.isArray(data.filterByUser)){
            error.filterByUser = "Please provide data in array format ['1','2']"   
        }
    }

    if(isEmpty(error)){
        return {sts:true,code:200,msg:"Validation success",rslt:[],error:[]}
    }else{
        return {sts:false,code:400,msg:"Validation fail",rslt:[],error:error}
    }
}

// DELETE POST VALIDATION
exports.delete_post = (data) => {
    const error = {};
    // POST ID
    data.postId = !isEmpty(data.postId) ? data.postId : "";
    if(validator.isEmpty(data.postId)){
        error.postId = "Please provide post Id"
    }
    if(isEmpty(error)){
        return {sts:true,code:200,msg:"Validation success",rslt:[],error:[]}
    }else{
        return {sts:false,code:400,msg:"Validation fail",rslt:[],error:error}
    }
}