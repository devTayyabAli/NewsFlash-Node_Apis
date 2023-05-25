const express = require("express");
const bodyParser = require("body-parser");

// import router 
const {getUser} = require("../controller/userController");
const { changePassword, create_user_profile, User_Sign_in, sendOTP, VarifyOTP } = require("../controller/User_ProfileController");
const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.route("/getUser").get(getUser)
router.route("/changePassword/:email").put(changePassword)
router.route("/create_user_profile").post(create_user_profile)
router.route("/User_Sign_in").post(User_Sign_in)
router.route("/sendOTP").post(sendOTP)
router.route("/VarifyOTP").post(VarifyOTP)










module.exports = router;