const mongoose = require("mongoose");
// let objectId = mongoose.Schema.Types.ObjectId;


const customerSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
    },
    lname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    // address:{
    //     type:objectId,
    //     ref:"Address",
    //     required:true,
    // },
    isDeleted:{
        type:Boolean,
        default:false,
    }

},{timestamps:true})

module.exports = mongoose.model("customer",customerSchema);