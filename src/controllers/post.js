/***********************************
    fileName    : post.js
    Description : Mother class for post related apis
    Author      : Vishwa
    createdAt   : 13JAN2024
************************************/ 

module.exports = class post {
    #post_db = false;
    #user_db = false
    constructor(){
        try{
            // LOCAL MODULES
            this.#post_db   = require("../dbModels/post").get_db(); // ACCESS POST TABLE
            this.#user_db   = require("../dbModels/user").get_db(); // ACCESS USER TABLE
            this.validation = require("../validation/post");
            // NPM
            this.fs       = require("fs");
            this.mongoose = require("mongoose");
        }catch(e){
            console.log(e)
        }
    }

    /*
    CREATE POST
        - this function is used to create post for user
        - admin not allow to post
        - create folder using user mobile number and save file using user mob_timestamp
    */
    create_post = async(pro_info,callback) => {
        const data     = pro_info.body;
        const files    = pro_info.files;
        const validate = await this.validation.create_edit_post(data,files);
        if(!validate.sts){
            return callback(validate);
        }else{
            this.#user_db.findOne({_id:data.userId}).lean().then(async(user_data)=>{
                if(!user_data){
                    return callback({sts:false,code:400,msg:"Invalid user information",rslt:[],error:[]});
                }else{
                    const folder = `./uploads/${user_data.mobile}`
                    if(!this.fs.existsSync(folder)) {
                        await this.fs.mkdirSync(folder); // IF FOLDER NOT EXISTS CREATE FOLDER
                    }
                    const file_path = `${folder}/${user_data.mobile}_${Date.now()}.${files.uploadFile.ext}`; // FILE PATH
                    files.uploadFile.mv(file_path, err => {
                        if(err){
                            return callback({sts:false,code:500,msg:"Unable to save post",rslt:[],error:[]});
                        }else{
                            data.image     = file_path;
                            data.isPrivate = data.isPrivate ? eval(data.isPrivate) : false;
                            data.postedBy  = data.userId;
                            this.#post_db.create(data).then((ins_rslt)=>{
                                return callback({sts:true,code:200,msg:"Posted successfully",rslt:[],error:[]});
                            }).catch((err)=>{
                                if(this.fs.existsSync(file_path)){ // IF ANY ERROR REMOVE FILE FROM SERVER
                                    this.fs.unlinkSync(file_path)
                                }
                                return callback({sts:false,code:500,msg:"Unable to save post",rslt:[],error:[]});
                            });
                        }
                    });
                }
            }).catch((err)=>{
                return callback({sts:false,code:500,msg:"Unable to process",rslt:[],error:[]});
            });
        }
    }

    /*
        READ POST
            - use aggregation for join user table and pagnation process
    */

    read_post = async(pro_info,server_name,callback) => {
        const data = pro_info.body;
        const validate = await this.validation.read_post(data);
        if(!validate.sts){
            return callback(validate);
        }else{
            try{
                const query = {status : 1}
                if(!data.isUser){ // ADMIN
                    if(data.filterByUser.length > 0){
                        const user_ids = data.filterByUser.map((ids) => new this.mongoose.Types.ObjectId(ids))
                        query.userId = {$in:user_ids}
                    }
                }else{
                    query.userId = new this.mongoose.Types.ObjectId(data.userId)
                }
                if(data.searchValue){
                    let search = new RegExp(data.searchValue,"i");
                    query.$or = [{title:search},{description:search}]
                }
                // BUILD AGGREGATE QUERY
                const agg_qry = [
                    {$match:query},
                    {$lookup:{
                        from:"users",
                        let:{userId:"$userId"},
                        pipeline:[
                            {$match:{$expr:{$eq:["$_id","$$userId"]}}},
                            {$project:{name:1}}
                        ],
                        as:"user_rslt"
                    }},
                    {$unwind:"$user_rslt"},
                    {$project:{
                        _id:false,
                        postId:"$_id",
                        userName:"$user_rslt.name",
                        title:"$title",
                        description:"$description",
                        image:"$image",
                        isPrivate:{$toBool:"$isPrivate"}
                    }},
                    {$facet:{
                        data:[],
                        count:[
                            {$group:{
                                _id:null,
                                count:{$sum:1}
                            }},
                            {$project:{_id:0,count:1}}
                        ]
                    }},
                    {$project:{
                        data:"$data",
                        totalCount:{$ifNull:[{$arrayElemAt:["$count.count",0]},0]}
                    }}
                ]

                const optionArr = []
                // SORT
                if((data.sortBy) && (data.sortOrder)){
                    let sort = {};
                    sort[data.sortBy] = parseInt(data.sortOrder);
                    optionArr.push({$sort:sort});
                }
                
                // SKIP
                if(data.skip){
                    optionArr.push({$skip:data.skip});
                }
                // LIMIT
                if(data.limit){
                    optionArr.push({$limit:data.limit});
                }
                if(optionArr.length > 0){
                    agg_qry[4].$facet.data.push(...optionArr)
                }
                this.#post_db.aggregate(agg_qry).then((get_rslt)=>{
                    if(get_rslt.length === 0){
                        return callback({sts:false,code:200,msg:"No record found",rslt:[],error:[]});
                    }else{
                        var result = get_rslt[0].data.map((info)=>{
                            info.image  = info.image.replace("./","");
                            info.image  = server_name + "/" + info.image;
                            return info;
                        })
                        get_rslt[0].data = result;
                        return callback({sts:true,code:200,msg:"Get result",rslt:get_rslt[0],error:[]});
                    }
                }).catch((err)=>{
                    return callback({sts:false,code:500,msg:"Unable to get post details",rslt:[],error:[]});
                });
            }catch(e){
                return callback({sts:false,code:500,msg:"Unable to process",rslt:[],error:[]});
            }
        }
    }

    // EDIT POST
    edit_post = async(pro_info,callback) => {
        const data     = pro_info.body;
        const files    = pro_info.files;
        data.mode      = "edit" // ONLY FOR VALIDATION
        const validate = await this.validation.create_edit_post(data,files); // VALIDATION
        if(!validate.sts){
            return callback(validate);
        }else{
           const query = {_id:data.postId}
            this.#post_db.findOne(query).lean().then(async(post_data)=>{
                if(!post_data){
                    return callback({sts:false,code:400,msg:"No record found",rslt:[],error:[]});
                }else
                if((data.isUser) && (data.userId !== post_data.userId.toString())){ // CHECK USER DETAILS
                    return callback({sts:false,code:401,msg:"You don't have a permission to edit this post",rslt:[],error:[]});
                }
                let file_path = post_data.image.split("/");
                file_path[file_path.length - 1] = file_path[file_path.length - 2] + "_" + Date.now(); // GET THE URL PATH FROM EXISTIS URL
                file_path = file_path.join("/") + "." + files.uploadFile.ext;
                files.uploadFile.mv(file_path, err => {
                    if(err){
                        return callback({sts:false,code:500,msg:"Unable to edit post",rslt:[],error:[]});
                    }else{
                        data.image        = file_path;
                        data.isPrivate    = data.isPrivate ? eval(data.isPrivate) : false;
                        data.updatedBy    = pro_info.body.userId;
                        data.updatedDate  = new Date();
                        delete data.userId;
                        this.#post_db.findOneAndUpdate({_id:data.postId},data,{new:true}).then((edit_rslt)=>{
                            return callback({sts:true,code:200,msg:"Post updated successfully",rslt:[],error:[]});
                        }).catch((err)=>{
                            return callback({sts:false,code:500,msg:"Unable to updtae post",rslt:[],error:[]});
                        });
                    }
                });
            });
        }
    }

    // DELETE POST
    delete_post = async(pro_info,callback) => {
        const data = pro_info.body;
        const validate = await this.validation.delete_post(data); // VALIDATION
        if(!validate.sts){
            return callback(validate);
        }else{
            const query = {_id:data.postId}
            this.#post_db.findOne(query).lean().then(async(post_data)=>{
                if(!post_data){
                    return callback({sts:false,code:400,msg:"No record found",rslt:[],error:[]});
                }else
                if((data.isUser) && (data.userId !== post_data.userId.toString())){ // CHECK USER DETAILS
                    return callback({sts:false,code:401,msg:"You don't have a permission to delete this post",rslt:[],error:[]});
                }
                const del_info = {status:0,deletedDate:new Date(),deletedBy:data.userId};
                this.#post_db.findOneAndUpdate({_id:data.postId},del_info,{new:true}).then((del_rslt)=>{
                    return callback({sts:true,code:200,msg:"Post deleted successfully",rslt:[],error:[]});
                }).catch((err)=>{
                    return callback({sts:false,code:500,msg:"Unable to delete post",rslt:[],error:[]});
                });
            });
        }
    }

    // GET USERS
    get_user = (pro_info,callback) => {
        const query = {isActive:1}
        if(pro_info.body.isUser){
            query._id = new this.mongoose.Types.ObjectId(pro_info.body.userId)
        }
        this.#user_db.find(query,{_id:false,label:"$name",value:"$_id"}).then((user_rslt)=>{
            user_rslt.unshift({isDisable:true,lable:"----- Select User -----"})
            return callback({sts:true,code:200,msg:"List of Users",rslt:user_rslt,error:[]});
        })
    }

}