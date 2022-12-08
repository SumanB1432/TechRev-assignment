const mongoose  = require("mongoose");
const addressModel = require("../model/addressModel");
const customerModel = require("../model/customerModel");

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }
  let regex = /^[a-zA-Z]+$/;
  let pinRegex = /^[1-9][0-9]{5}$/;

  const createAddress = async function (req,res){
    try{
    let data = req.body;
    let {city,dist,state,pincode,customerId} = data;

    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:"please provide data"})
    }

    if(!isValid(city)){
        return res.status(400).send({status:false,message:"please provide city"})
    }
    if(!regex.test(city)){
        return res.status(400).send({status:false,message:"please insert a valid city"})
    }

    if(!isValid(dist)){
        return res.status(400).send({status:false,message:"please provide dist"})
    }

    if(!isValid(state)){
        return res.status(400).send({status:false,message:"please provide state"})
    }

    if(!isValid(pincode)){
        return res.status(400).send({status:false,message:"please provide pincode"})
    }
    if(!pinRegex.test(pincode)){
        return res.status(400).send({status:false,message:`${pincode} is not valid`})
    }

    if(!isValid(customerId)){
        return res.status(400).send({status:false,message:"please provide customerId"})
    }
    let checkCustomer = await customerModel.findById(customerId);
    if(!checkCustomer){
        return res.status(404).send({status:false,message:"Ths customer is not exist"})
    }
    if(!mongoose.isValidObjectId(customerId)){
        return res.status(400).send({status:false,message:`${customerId} is a invalid customerID`})
    }
    
   let address = await addressModel.create(data);
   return res.status(201).send({status:true,data:address})
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}
    
}



module.exports = {createAddress}