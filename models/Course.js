const mongoose = require("mongoose");

const courseSchema  = new mongoose.Schema({
    courseName:{
        type:String,

    },
    courseDescription:{
        type:String,

    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    },
    whatYouWillLearn:{
        type:String,

    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",

    }],
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",

    }],
    thumbnail:{
        type:String,

    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },


});

module.exports = mongoose.model("Course",courseSchema);

