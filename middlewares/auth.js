const jwt = require("jsonwebtoken");
require("dotenv").config();
const User =require("../models/User");


// auth
exports.auth = async (req,res,next) => {
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("bearer","");

        // if token, missing then return res
        if(!token){
            return res.status(401).json({
                success:true,
                message:"Token is missing",
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err){
            // verification - issue
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            });


        
        }
        next();


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token",

        });

    }
}

// isStudent
exports.isStudent = async (req,res)=>{
    try{
        if (req.user.accountType != "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student only",
            });


        }
        next();
    }
    catch(erro){
        return res .status(500).json({
            success:false,
            message:"User role cannot be verified.please try again",
        });

    }
}
// isInstructor
exports.isInstructor = async (req,res) =>{
    try{
        if(req.user.accountType != " Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor",
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
          });

    }
}
// isAdmin

exports.isAdmin = async(req,res) => {
    try{
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is the protected rote for admin only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,try it again",
        });
    }
}
