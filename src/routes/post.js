/***********************************
    fileName    : post.js
    Description : for user post related routes
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

module.exports = function({Router}){
    const route    = Router(); // CALL ROUTER METHOD
    const post     = require("../controllers/post");
    const post_obj = new post();
   
    // CREATE POST
    route.post("/create_post",(req,res)=>{
        post_obj.create_post(req,(post_rslt)=>{
            res.status(post_rslt.code).json(post_rslt);
        })
    });

    // READ POST
    route.post("/read_post",(req,res)=>{
        const server_name =  req. protocol + '://' + req. get('host');
        post_obj.read_post(req,server_name,(get_rslt)=>{
            res.status(get_rslt.code).json(get_rslt);
        })
    });

    // EDIT POST
     route.post("/edit_post",(req,res)=>{
        post_obj.edit_post(req,(edit_rslt)=>{
            res.status(edit_rslt.code).json(edit_rslt);
        })
    });

    // DELETE POST
    route.post("/delete_post",(req,res)=>{
        post_obj.delete_post(req,(delete_rslt)=>{
            res.status(delete_rslt.code).json(delete_rslt);
        })
    });

    // GET USERS
    route.post("/get_user",(req,res)=>{
        post_obj.get_user(req,(user_rslt)=>{
            res.status(user_rslt.code).json(user_rslt);
        })
    });

    return route;
}   