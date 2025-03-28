const {User} = require("../model/schema")
const generateTokens = require('../token/generateToken')
const bcrypt = require('bcrypt')
const Login =async(req,res)=>{
try {
    const{email,password}=req.body
if(!email || !password){
    res.status(400).json({
        message:'fill the field properly'
    })
    return
}

const emailCheck = await User.findOne({email:email})
if(!emailCheck){
    res.status(404).json({
        message:'user not found!'
    })
    return
}


const decoded = await bcrypt.compare(password,emailCheck.password)
if(!decoded){
    res.status(400).json({
        message:'password is wrong!'
    })
    return
}

const token = generateTokens(emailCheck._id.toString())
if(!token){
    res.status(400).json({
        message:'login failed!'
    })
    return
}

res.status(200).json({
    message:'login successfully!',
    data:`${token}`
})

} catch (error) {
    res.status(400).json({message:error})
}
}

const getprofile =async(req,res)=>{
const userid = req.user
if(!userid){
    res.status(400).json({
        message:'user need to login'
    })
    return
}
const userinfo = await User.findById(userid)
res.status(200).json({
    message:'this is user info',
    data:userinfo
})
}
const victory = async (req, res) => {
    try {
      const userid = req.user;
      if (!userid) {
        return res.status(400).json({ message: "User not found!" });
      }
  
      const userinfo = await User.findOne({ _id: userid });
      if (!userinfo) {
        return res.status(400).json({ message: "User not found!" });
      }
  
      const matchIdsclash = userinfo.victory.pubgTdm;
      const matchesclash = await tdm.find({
        _id: { $in: matchIdsclash },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdff = userinfo.victory.FreefireFull;
      const matchesff = await FFfreefire.find({
        _id: { $in: matchIdff },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdspubg = userinfo.victory.pubgFull;
      const matchespubg = await PubgFull.find({
        _id: { $in: matchIdspubg },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdstdm = userinfo.victory.FreefireClash;
      const matchestdm = await Clashsqaud.find({
        _id: { $in: matchIdstdm },
        status: { $in: ["pending", "running"] },
      });
  
      res.status(200).json({
        matchesclash,
        matchesff,
        matchespubg,
        matchestdm,
      });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  };
  const loss = async (req, res) => {
    try {
      const userid = req.user;
      if (!userid) {
        return res.status(400).json({ message: "User not found!" });
      }
  
      const userinfo = await User.findOne({ _id: userid });
      if (!userinfo) {
        return res.status(400).json({ message: "User not found!" });
      }
  
      const matchIdsclash = userinfo.loss.pubgTdm;
      const matchesclash = await tdm.find({
        _id: { $in: matchIdsclash },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdff = userinfo.loss.FreefireFull;
      const matchesff = await FFfreefire.find({
        _id: { $in: matchIdff },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdspubg = userinfo.loss.pubgFull;
      const matchespubg = await PubgFull.find({
        _id: { $in: matchIdspubg },
        status: { $in: ["pending", "running"] },
      });
  
      const matchIdstdm = userinfo.loss.FreefireClash;
      const matchestdm = await Clashsqaud.find({
        _id: { $in: matchIdstdm },
        status: { $in: ["pending", "running"] },
      });
  
      res.status(200).json({
        matchesclash,
        matchesff,
        matchespubg,
        matchestdm,
      });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  };

module.exports ={Login,getprofile,victory,loss}