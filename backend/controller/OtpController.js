const Otp = require("../model/OtpModel");
const sendOtpEmail = require("../config/nodemailer");
const signUp = require("../model/signUpModel");
const bcrypt = require('bcrypt')
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const requestOtp = async (req, res) => {
  try {
    const { email,password,username } = req.body;
    if(!email||!password||!username){
        res.status(400).json({
            message:'fill the field properly'
        })
        return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Enter a valid Gmail address" });
      }
    
    if (password.length < 8) {
         res.status(400).json({ message: "Password must be at least 8 characters long" });
         return
      }
      const verifyemail = await signUp.findOne({email:email})
      if(verifyemail){
          res.status(400).json({
              message:'email already use'
          })
          return
      }
      
    const verifyuser = await signUp.findOne({username:username})
    if(verifyuser){
        res.status(400).json({
            message:'username already taken'
        })
        return
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 minutes

    await Otp.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};
const verifyOtpandSignup = async (req, res) => {
    try {
      const { email, otp,password,username } = req.body;
      
      if (!email || !otp || !password || !username) return res.status(400).json({ message: "All credentials are require!!" });
  
      const otpRecord = await Otp.findOne({ otp });
  
      if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
  
      if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
      }
  
      await signUp.create({
        username,
        email,
        image:"",
    uid:[{
        freefire:"",
        pubg:"",
        cod:""
    }
    ],
        password:await bcrypt.hash(password,11),
        matchId:"",

    })
      res.status(200).json({ message: "OTP verified successfully" });
  
      await Otp.deleteOne({ _id: otpRecord._id }); // Remove OTP after verification
    } catch (error) {
      res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
  };
  
  

module.exports = { requestOtp,verifyOtpandSignup};
