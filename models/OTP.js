const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        // 5 min
        expires:5*60,
    },


});

// function to send otp on mail(premiddleware)

async function senderVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"verfication email from studyNotion",otp);
        console.log("email sent Successfully:" , mailResponse);
    }
    catch(error){
        console.log("error occurred while sending mails:", error);
        throw error;

    }
}

OTPSchema.pre("save", async function(next){
    await senderVerificationEmail(this.email,this.otp);
    next();
})



module.exports = mongoose.model("OTP",OTPSchema);
