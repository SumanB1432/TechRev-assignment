const { isValidObjectId, default: mongoose } = require("mongoose");
let jwt = require("jsonwebtoken")
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

/////////////////////////////////------------CREATE CUSTOMER---------------------------//////////////////////////////////////////////////////////
  const createCustomer = async function(req,res){
    try{
    let data = req.body;
    let {fname,lname,email,password,phone} = data

    /********************************VALIDATIONS **********************************************************/
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

const isRegisterEmail = await customerModel.findOne({ email: email })//CHECK DUPLICASY

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

const isRegisterPhone = await customerModel.findOne({ phone: phone })//CHECK DUPLICASY

 if (isRegisterPhone) {
    return res.status(400).send({ status: false, message: "phone number is already registered" })
}
if (!isValidPassword(password)){
 return res.status(400).send({ status: false,message: "Please provide a valid password ,Password should be of 8 - 15 characters", })
    }

    let customer = await customerModel.create(data); //CREATE CUSTOMER
    return res.status(201).send({status:true,data:customer});
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}
    
  }
  ////////////////////////////////////////////////-------LOGIN-------------------////////////////////////////////////
  let login = async function (req, res) {
    try {
  
      let data = req.body;
      const { email, password } = data;

      /********************************VALIDATIONS **********************************************************/
  
      if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, message: "email & password must be given" });
      }
      
      
      if (!isValid(email)) {
        return res.status(400).send({ status: false, messgage: "email is required " });
      }
  
  
      if (!isValid(password)) {
        return res.status(400).send({ status: false, messsge: "password is required" });
      }
  
      let checkCustomer = await customerModel.findOne({
        email: email,
        password: password,
      });
  
      if (!checkCustomer) {
        return res.status(401).send({ status: false, message: "email or password is not correct" });
      }
     
  
      let date = Date.now();
      let createTime = Math.floor(date / 1000);
      let expTime = createTime + 3000;
  
      let token = jwt.sign(
        {
          customerId: checkCustomer._id.toString(),  //CREATE JWT TOKEN
          iat: createTime,
          exp: expTime,
        },
        "whoAMi_Suman"
      );
  
      res.setHeader("x-api-key", token);
      return res.status(200).send({ status: true, message: "Success", data: { token: token } });
    } 
    catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };

  //////////////////////////////////////------------GET CUSTOMER------------------/////////////////////////////////

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

//////////////////////////////////////////////////////-------------GET BY ID---------------------////////////////////
const getCustomerById = async function (req,res){
    try {
        let customerId = req.params.customerId;
 /********************************VALIDATIONS **********************************************************/
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
///////////////////////////////////////////////////////////----delete customer------//////////////////////////////////////////////////

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
////////////////////////////////------------UPDATE CUSTOMER--------------------/////////////////////////////////////////////////

const updateCustomer = async function(req,res){
    try{
    let data = req.body;
    let customerId = req.params.customerId;
    /********************************VALIDATIONS **********************************************************/
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:"Please provide data to update details"});
    }

    if(!customerId){
        return res.status(400).send({status:false,status:"please procide customerId"})
    }
    if(!mongoose.isValidObjectId(customerId)){
        return res.status(400).send({status:false,message:`${customerId} is a invalid Id`})
    }

    let getCustomer = await customerModel.findOne({_id:customerId,isDeleted:false});
    if(!getCustomer){
        return res.status(404).send({status:false,message:"No such customer exist"})
    }

    if(data.fname!=undefined){
        if(!isValid(data.fname) || typeof data.fname!="string" || !data.fname.trim().match(/^[a-zA-Z]+$/) ){
            return res.status(400).send({status:false,message:"please provide a valid first_name"})
        }
        
    }
    if(data.lname !=undefined){
        if(!isValid(data.lname) || typeof data.lname!="string" || !data.lname.trim().match(/^[a-zA-Z]+$/) ){
            return res.status(400).send({status:false,message:"please provide a valid last_name"})
        }
    }
    if(data.email !=undefined){
        if(!isValid(data.email) || typeof data.email!="string" || !data.email.trim().match(emailRegex) ){
            return res.status(400).send({status:false,message:"please provide a valid email"})
        }
        let getEmail = await customerModel.findOne({email:data.email,isDeleted:false}); //CHECK DUPLICASY

        if(getEmail !=undefined){
            return res.status(400).send({status:false,message:`${data.email} is already registered`})
        }

    }
    if(data.password!=undefined){
        if(!isValid(data.password) || typeof data.password!="string" || !isValidPassword(data.password) ){
            return res.status(400).send({status:false,message:"please provide a valid password/Please provide a valid password ,Password should be of 8 - 15 characters"})
        }
    }

    if(data.phone!=undefined){
        if(!isValid(data.phone) || typeof data.phone!="number" || !phone.trim().match(phoneRegex)){
            return res.status(400).send({status:false,message:`${data.phone} is not valid`})
        }
        let getPhone = await customerModel.findOne({phone:data,phone,isDeleted:false});//CHECK DUPLICASY
        if(getPhone){
            return res.status(400).send({status:false,message:"This phone no is already registered"})
        }
    }

    const updateCustomer = await customerModel.findByIdAndUpdate({_id:customerId},{
        fname:data.fname,
        lname:data.lname,
        email:data.email,
        password:data.password,
        phone:data.phone
    },{new:true,upsert:true});
    return res.status(200).send({status:true,message:"updated successfully",data:updateCustomer})
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}



}

  module.exports={createCustomer,listOfCustomer,getCustomerById,deleteCustomer,login,updateCustomer}
