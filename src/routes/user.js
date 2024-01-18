/***********************************
    fileName    : user.js
    Description : for user login and register routes
    Author      : Vishwa
    createdAt   : 12JAN2024
************************************/ 

module.exports = function({Router}){
    const route    = Router(); // CALL ROUTER METHOD
    const user     = require("../controllers/user");
    const user_obj = new user();

    // GET ROLES
    route.post("/get_role",(req,res)=>{
        user_obj.get_role(req,(role_rslt)=>{
            res.status(role_rslt.code).json(role_rslt);
        })
    });


    // REGISTER
    route.post("/register",(req,res)=>{
        user_obj.register(req,(user_rslt)=>{
            res.status(user_rslt.code).json(user_rslt);
        })
    });

    // LOGIN
    route.post("/login",(req,res)=>{
        user_obj.login(req,(login_rslt)=>{
            res.status(login_rslt.code).json(login_rslt);
        })
    });
    
    return route;
}   