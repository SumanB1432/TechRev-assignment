const express = require("express");
const router = express.Router();
let customerController = require("../controller/customerController");
let addressController = require("../controller/addressController")
let middleWare = require("../middleware/auth")


router.post("/insertCustomer",customerController.createCustomer);//CREATE CUSTOMER
router.post("/login",customerController.login);//LOGIN CUSTOMER
router.get("/selectCustomer",customerController.listOfCustomer);//GET CUSTOMER DETAILS
router.post("/selectCustomerById/:customerId",customerController.getCustomerById);//GET CUSTOMER DETAILS BY ID
router.post("/updateCustomer/:customerId",middleWare.Authentication,customerController.updateCustomer)//UPDATE CUSTOMER DETAILS
router.post("/deleteCustomer/:customerId",middleWare.Authentication,customerController.deleteCustomer);//DELETE CUSTOMER DETAILS
router.post('/insertAddress',addressController.createAddress);//CREATE ADDRESS 
router.put("/updateAddress/:customerId/:addressId",middleWare.Authentication,addressController.addressUpdate)//UPDATE ADDRESS




router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });


module.exports = router;