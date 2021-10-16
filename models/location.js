var mongoose=require("mongoose");
require('dotenv').config();


var locationSchema=mongoose.Schema({
    location_name:{
        type:String,
        required:true,
        maxlength:100
    },
    location_details:{
        type:Array,
        default:[]
    },
},{timestamps:true})

var Location=mongoose.model('Location',locationSchema);

module.exports={ Location }