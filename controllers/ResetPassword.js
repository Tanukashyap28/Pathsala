const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken
exports.reesetPasswordToken = async (req,res) => {
    try{
        // get mail from req body
        const {email} = req.body.email;
        // check user for this mail ,email validation
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:"you email is not registered with us"
            });
        }

        // generate token
        const token = crypto.randomUUID();
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                // 5min
                resetPasswordExpires: Date.now()+ 5*60*1000,

            },

        );

        // create url
        const url = `http://localhost:3000/update-password/${token}`
        // send mail containing the url
        await mailSender(email,
            "password Reset link",
            `password reset Link :${url}`
        );

        // return response
        return res.json({
            success:true,
            message:"Email sent Successfully,please check email and password",
        });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail",
        });

    }
}
    
// resetpassword

exports.resetPassword = async (req,res) => {
    try{
        const {password,confirmPassword,token} = req.body;
        // validation
        if(password!= confirmPassword){
            return res.json({
                success: false,
                message:"Password not Matching",
            });
        }

        // get user details from db using token
        const userDetails = await User.findOne({token:token});
        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token is expires,please regenerate your token",
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10);
        // password update 
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            // give updated doc
            {new:true},
        );
        // retun res
        return res.status(200).json({
            success:true,
            message:"Password reset Successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Somewith went wrong while sending reset password mail",
        });

    }
}