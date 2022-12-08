const mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;


const addressSchema = new mongoose.Schema({
    city:{
        type:String,
        required:true,
        upperCase:true,
    },
    dist:{
        type:String,
        requires:true,
        upperCase:true,
    },
    state:{
        type:String,
        required:true,
        upperCase:true,

    },
    pincode:{
        type:Number,
        required:true,

    },
    customerId:{
       type:objectId,
       required:true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }

},{timestamps:true})

module.exports = mongoose.model("address",addressSchema);