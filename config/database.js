// good practice write all require on top
const mongoose = require("mongoose");
require("dotenv").config();

exports.connects = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log("DB connected Successfully"))
    .catch((error) => {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    } )

};
