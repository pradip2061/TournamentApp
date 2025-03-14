const Otp = require("../model/OtpModel");
const sendOtpEmail = require("../config/nodemailer");
const { User } = require("../model/schema");
const bcrypt = require("bcrypt");
const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
const OtpModel = require("../model/OtpModel");
const requestOtp = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({
        message: "fill the field properly",
      });
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid Gmail address" });
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }
    const verifyemail = await User.findOne({ email: email });
    if (verifyemail) {
      res.status(400).json({
        message: "email already use",
      });
      return;
    }

    const verifyuser = await User.findOne({ username: username });
    if (verifyuser) {
      res.status(400).json({
        message: "username already taken",
      });
      return;
    }
    const emailid = await OtpModel.find({ email: email });
    if (emailid.length >= 3) {
      return res
        .status(400)
        .json({ message: "your today otp limit is exceed" });
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 minutes

    await Otp.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};
const verifyOtpanduser = async (req, res) => {
  try {
    const { email, otp, password, username } = req.body;

    if (!email || !otp || !password || !username)
      return res.status(400).json({ message: "All credentials are require!!" });

    const otpRecord = await Otp.findOne({ otp });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      image: "",
      uid: [
        {
          freefire: "",
          pubg: "",
          cod: "",
        },
      ],
      password: await bcrypt.hash(password, 11),
      matchId: {
        pubgFullId: [],
        pubgTdmId: [],
        FreefireFullId: [],
        FreefireClashId: [],
        codId: [],
      },
      Loss: {
        pubg: [],
        Freefire: [],
        cod: [],
      },
      victory: {
        pubg: [],
        Freefire: [],
        cod: [],
      },
      gameName: [
        {
          freefire: "",
          pubg: "",
          cod: "",
        },
      ],

      friends: [
        {
          username: "admin",
          image:
            "https://firebasestorage.googleapis.com/v0/b/khelmela-98.firebasestorage.app/o/mainLogo%2Flogo.jpg?alt=media&token=07f1f6ae-2391-4143-83f4-6ff44bba581b",
          id: "admin",
        },
      ],
    });

    // Find all admin users and add the new user to their friends lists
    await User.updateMany(
      { role: "admin" }, // Find all users with role "admin"
      {
        $push: {
          friends: {
            username: username,
            image: newUser.image || "",
            id: newUser._id.toString(), // Convert ObjectId to string if needed
          },
        },
      }
    );

    res.status(200).json({ message: "OTP verified successfully" });

    await Otp.deleteOne({ _id: otpRecord._id }); // Remove OTP after verification
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      messsage: "plz provide the email",
    });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter a valid Gmail address" });
  }
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 minutes

  await Otp.create({ email, otp, expiresAt });

  await sendOtpEmail(email, otp);

  res.status(200).json({ message: "OTP sent to your email" });
};
const resetOtpVerify = async (req, res) => {
  const { otp, email, newPassword, confirmPassword } = req.body;
  const otpRecord = await Otp.findOne({ otp });
  if (!otp || !email) {
    return res.status(400).json({
      message: "both are required!",
    });
  }
  if (newPassword != confirmPassword) {
    return res.status(400).json({
      message: "password isnot match",
    });
  }

  const hashPassword = await bcrypt.hash(confirmPassword, 11);
  if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
  if (otpRecord.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  const userinfo = await User.findOne({ email }).select("password");
  userinfo.password = hashPassword;
  await userinfo.save();
  res.status(200).json({
    message: "password change successfully",
  });
};

module.exports = {
  requestOtp,
  verifyOtpanduser,
  resetPassword,
  resetOtpVerify,
};