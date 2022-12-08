const express = require("express");
const router = express.Router();
let customerController = require("../controller/customerController");
let addressController = require("../controller/addressController")


router.post("/insertCustomer",customerController.createCustomer)
router.get("/selectCustomer",customerController.listOfCustomer)
router.post("/selectCustomerById/:customerId",customerController.getCustomerById)
router.post("/deleteCustomer/:customerId",customerController.deleteCustomer)
router.post('/insertAddress',addressController.createAddress)




router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });


module.exports = router;