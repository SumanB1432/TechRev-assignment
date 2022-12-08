const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const route = require("./routes/route")
const app = express();

app.use(bodyParser.json());






mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/techev-assignment").then(()=>{
    console.log("mongodb is connected successfully")
}).catch((err)=>{
    console.log(err)
})

app.use("/",route)
app.use((req,res,next)=>{
    res.status(404).send({status:false,message:`not found ${req.url}`});
    next();
})



let port = 3000
app.listen(port,(err)=>{
    if(!err){
        console.log(`connected to port no ${port}`)
    }
})











