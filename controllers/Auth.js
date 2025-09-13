const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

// sendOTP
exports.sendOTP = async (res,req) =>{
    try{
        // fetch email from request body
        const {email} = req.body;
        // check if mail user already exist
        const checkUserPresent = await User.findOne({email});

        // if user already exist , then return response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        // generate otp 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,

        });
        console.log("OTP generated:",otp);

        // check unique otp or not(best practice is used such library whisch automatically generate uniqe otp)
        let result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator(6,{
                  upperCaseAlphabets:false,
                  lowerCaseAlphabets:false,
                  specialChars:false,
            });
            result = await OTP.findOne({otp:otp});

        }

        const otpPayload = {email,otp};

        // create an entry for otp in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return respond successfully 
        res.status(200).json({
            success:true,
            message:"OTP send successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error.message",
        })

    }
};


// signup

exports.signUp = async (req,res) =>{
    try{
        // data fetch fro request ki body 
        const {firstName,lastName,email,password,confirmPAssword,accountType,contactNumber,otp} = req.body;

        // validate data 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"all fields are required",
            })
        }

        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered",
            });
        }

        // find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // validate otp
        if(recentOtp.length ==0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:"OTP  found",
            })
        }
        else if(otp !== recentOtp.otp){
            // invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }

        // Hash password
        const HasedPassword = await bcrypt.hash(password,10);

        // entry create in db

        const profileDetails = await Profiler.create({
            gender:null,
            dateOfBirth: null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,lastName,email,contactNumber,
            password:hashedPassword,
            accountType,
            additonaldetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })

        // return res
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })

    }
    catch(error){
        console.log(error);
        return res. status(500).json({
            success:false,
            message:"User cannot registered. Please try again",
        })
        
    }

}


// login
exports.login = async (req, res) =>{
    try{
        // fetch data from req bodt
        const {email,password} = req.body;

        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All field required , try again",

            });
        }

        // check user exit or not
        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(403).json({
                success:false,
                message:"User is not Registered.please signup first",
            });

        }

        // generate jwt token,after passing matching
        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email: user.email,
                id:user._id,
                role:user.role,

            }
            const token = jwt.sign(payload,preprocessCSS.env,JWT_SECRET,{
                expiresIn:'2h',

            });
            user.token = token;
            user.password=undefined;

            // create cookie and send response
            const options ={
                // 3 days
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in successfully",
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure,please try again",

        });
    }
};
// changePassword
// todo: HOMEWORK

exports.changePassword = async (req, res) =>{
    try{
        // get data from req body
        const {} = req.body;
        // get oldpassword ,newpassword, confirm password
        // validation
        // update password in db
        // send mail- that password is updated
        // return response


    }
    catch(error){

    }
}
























