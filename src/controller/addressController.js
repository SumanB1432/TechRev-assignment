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
const addressUpdate = async function(req,res){
    try {
        let data = req.body;
        let customerId = req.params.customerId;
        let addressId = req.params.addressId;

        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide data for update"})
        }
        if(!mongoose.isValidObjectId(customerId)){
            return res.status(400).send({status:false,message:`${customerId} is not valid`})
        }
        if(!mongoose.isValidObjectId(addressId)){
            return res.status(400).send({status:false,message:`${addressId} is not valid`})
        }

        let getCustomer = await customerModel.findOne({_id:customerId,isDeleted:false})
        let getAddress = await addressModel.findOne({_id:addressId,customerId:customerId,isDeleted:false});
        if(!getCustomer){
            return res.status(404).send({status:false,message:"No such customer exist"})
        }
        if(!getAddress){
            return res.status(404).send({status:false,message:"No such address exist"})
        }
        console.log(data.city)

        if(data.city !=undefined){
            if(!isValid(data.city) || typeof data.city !="string"){
                return res.status(400).send({status:false,message:"Please provide a valid city "})
            }
        }
        if(data.dist!=undefined){
            if(!isValid(data.dist) || typeof data.dist!="string"){
                return res.status(400).send({status:false,message:"Please provide a valid distict"})
            }
        }
        if(data.state !=undefined){
            if(!isValid(data.state) || typeof data.state != "string"){
              return res.status(400).send({status:false,message:"please provide a valid state"})
            }
        }
        if(data.pincode !=undefined){
            if(!isValid(data.pincode) || typeof data.pincode !="number" || !pinRegex.test(data.pincode)){
                return res.status(400).send({status:false,message:"please provide a valid pincode"})
            }
        }
        
        const updateAddress = await addressModel.findOneAndUpdate({_id:addressId,customerId:customerId},{
            city:data.city,
            dist:data.dist,
            state:data.state,
            pincode:data.pincode
        },{new:true,upsert:true})
        return res.status(200).send({status:true,messahe:"update successfully",data:updateAddress})
    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }
}



module.exports = {createAddress,addressUpdate}