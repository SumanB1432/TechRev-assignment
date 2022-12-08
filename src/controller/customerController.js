const { isValidObjectId, default: mongoose } = require("mongoose");
const addressModel = require("../model/addressModel");
const customerModel = require("../model/customerModel");

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }

const isValidPassword = (password) => {
    if (password.length > 7 && password.length < 16) return true
  }
  let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/


  const createCustomer = async function(req,res){
    try{
    let data = req.body;
    let {fname,lname,email,password,phone} = data
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:"Please give some data to create customer"})
    }
if(!isValid(fname)){
    return res.status(400).send({satus:false,message:"Please provide your first_name"})
}
if(!fname.trim().match(/^[a-zA-Z]+$/)){
    return res.status(400).send({status:false,message:"please provide a valid first_name"})
}

if(!isValid(lname)){
    return res.status(400).send({satus:false,message:"Please provide your last_name"})
}
if(!lname.trim().match(/^[a-zA-Z]+$/)){
    return res.status(400).send({status:false,message:"please provide a valid last_name"})
}

if (!isValid(email)) return res.status(400).send({ status: false, Message: "Please provide your email address" })

const isRegisterEmail = await customerModel.findOne({ email: email })

if (isRegisterEmail) {
return res.status(400).send({ status: false, message: "Email id already registered" })
}

if (!email.trim().match(emailRegex)){
return res.status(400).send({ status: false, message: "Please enter valid email" })
}

if (!isValid(phone)){
return res.status(400).send({status: false,Message: "Please provide your phone number"})
    }

if (!phone.trim().match(phoneRegex)){
return res.status(400).send({ status: false, message: "Please enter valid pan -Indian phone number" })
}

const isRegisterPhone = await customerModel.findOne({ phone: phone })

 if (isRegisterPhone) {
    return res.status(400).send({ status: false, message: "phone number is already registered" })
}
if (!isValidPassword(password)){
 return res.status(400).send({ status: false,message: "Please provide a valid password ,Password should be of 8 - 15 characters", })
    }

    let customer = await customerModel.create(data);
    return res.status(201).send({status:true,data:customer});
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}
    
  }

  ////////------------GET CUSTOMER------------------/////////////////////////////////

const listOfCustomer = async function (req,res){
    try{
    let list= await customerModel.find({isDeleted:false});
    if(list.length==0){
        return res.status(404).send({status:false,message:"no customer present"})
    }
    let fullList = [];

    for(let i=0;i<list.length;i++){
        let id = list[i]._id;
        let address = await addressModel.find({customerId:id,isDeleted:false}).select({city:1,state:1,dist:1,pincode:1,})
        fullList.push({
            "fname":list[i].fname,
            "lname":list[i].lname,
            "email":list[i].email,
            "password":list[i].password,
            "phone":list[i].phone,
            "address":address
        })
    }

    return res.status(200).send({status:true,data:fullList})
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}
}

///////////////-------------GET BY ID---------------------////////////////////
const getCustomerById = async function (req,res){
    try {
        let customerId = req.params.customerId;

        if(!customerId){
            return res.status(400).send({status:false,message:"please provide customerId"})
        }
        if(!mongoose.isValidObjectId(customerId)){
            return res.status(400).send({status:false,message:"please enter a valid customerId"})
        }
        let data = await customerModel.findOne({_id:customerId,isDeleted:false});
        if(!data){
            return res.status(404).send({status:false,message:"No such customer exist"})
        }
        let address = await addressModel.find({customerId:customerId,isDeleted:false}).select({city:1,state:1,dist:1,pincode:1,})

        let totalDetails={
            "fname":data.fname,
            "lname":data.lname,
            "email":data.email,
            "password":data.password,
            "phone":data.phone,
            "address":address
        }

        return res.status(200).send({status:true,data:totalDetails})

    } catch (err) {
        return res.status(500).send({status:false,message:err.message})
    }

}
////////----delete customer------//////////////////////

const deleteCustomer = async function(req,res){
    try {
        let customerId = req.params.customerId;

        if(!customerId){
            return res.status(400).send({status:false,message:"please provide customerId"})
        }
        if(!mongoose.isValidObjectId(customerId)){
            return res.status(400).send({status:false,message:'please provide a valid customerID'})
        }
        let find = await customerModel.findOne({_id:customerId,isDeleted:false})
        if(!find){
            return res.status(404).send({status:false,message:`${customerId} is already deleted or not exist`})
        }
        let del = await customerModel.findByIdAndUpdate(customerId,{isDeleted:true})
        let deleteinAddress = await addressModel.updateMany({customerId:customerId,isDeleted:false},{isDeleted:true})
        return res.status(200).send({status:false,message:"Deleted successfully"})
    } catch (err) {
        return res.status(500).send({status:false,message:err.message})
    }
}

  module.exports={createCustomer,listOfCustomer,getCustomerById,deleteCustomer}
