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
        message: "User already exists",
      });
      return;
    }

    if (/[A-Z]/.test(username)) {
      return res
        .status(400)
        .json({ message: "Username can only contain lowercase letters" });
    }

    if (username.includes(" ")) {
      return res.status(400).json({ message: "Username can't contain spaces" });
    }
    if (!/^[a-z0-9]+$/.test(username)) {
      return res
        .status(400)
        .json({ message: "no special character are allowed" });
    }
    // Check if username already taken
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }
    const emailid = await OtpModel.find({ email: email });
    if (emailid.length >= 9) {
      return res
        .status(400)
        .json({ message: "Your today otp limit is exceed" });
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
        pubgFull: [],
        pubgTdm: [],
        FreefireFull: [],
        FreefireClash: [],
        cod: [],
      },
      victory: {
        pubgFull: [],
        pubgTdm: [],
        FreefireFull: [],
        FreefireClash: [],
        cod: [],
      },
      gameName: [
        {
          freefire: "",
          pubg: "",
          cod: "",
        },
      ],

      friends: [{ id: "admin" }],
    });

    await User.updateMany(
      { role: "admin" }, // Find all users with role "admin"
      {
        $push: {
          friends: {
            id: newUser._id.toString(),
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
