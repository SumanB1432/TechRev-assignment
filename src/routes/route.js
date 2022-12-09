const express = require("express");
const router = express.Router();
let customerController = require("../controller/customerController");
let addressController = require("../controller/addressController")
let middleWare = require("../middleware/auth")


router.post("/insertCustomer",customerController.createCustomer);
router.post("/login",customerController.login);
router.get("/selectCustomer",customerController.listOfCustomer);
router.post("/selectCustomerById/:customerId",customerController.getCustomerById);
router.post("/updateCustomer/:customerId",middleWare.Authentication,customerController.updateCustomer)
router.post("/deleteCustomer/:customerId",middleWare.Authentication,customerController.deleteCustomer);
router.post('/insertAddress',addressController.createAddress);
router.put("/updateAddress/:customerId/:addressId",middleWare.Authentication,addressController.addressUpdate)




router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });


module.exports = router;