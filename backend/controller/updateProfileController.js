const ClashSquad = require("../model/ClashSquadModel")
const RateLimit = require("../model/RateLimitModel")
const {User} = require("../model/schema")
const tdm = require("../model/TdmModel")
const timelimit = require("../model/TimeLimitModel")
const mongoose =require('mongoose')
const updateProfile = async (req, res) => {
    const userId = req.user;
    const { username } = req.body;

    // Trim and validate
    const trimmedUsername = username.trim();

    if (/[A-Z]/.test(trimmedUsername)) {
        return res.status(400).json({ message: "Username can only contain lowercase letters" });
    }

    if (/\s/.test(trimmedUsername)) {
        return res.status(400).json({ message: "Username can't contain spaces" });
    }

    // Check if username already taken
    const checkUsername = await User.findOne({ username: trimmedUsername });
    if (checkUsername) {
        return res.status(409).json({ message: "Username already taken" });
    }

    const userInfo = await User.findOne({ _id: userId });
    const limit = await RateLimit.findOne({ userId });

    if (limit) {
        const timeSinceLastRequest = Date.now() - limit.lastRequest;
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        if (timeSinceLastRequest < twoHoursInMs) {
            const timeRemaining = twoHoursInMs - timeSinceLastRequest;
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

            return res.status(429).json({
                message: `You can update after ${hours}hr ${minutes}min`
            });
        }
    }

    userInfo.username = trimmedUsername;
    await userInfo.save();

    await RateLimit.findOneAndUpdate(
        { userId },
        { lastRequest: Date.now(), requestCount: 1 },
        { upsert: true }
    );

    res.status(200).json({
        message: "Updated successfully"
    });
};

const pubgprofile=async(req,res)=>{
const{pubgName,pubgUid}=req.body
if(!pubgName||!pubgUid){
    return res.status(400).json({
        message:'plz provide gameName'
    })
}
const userid =req.user
const userinfo =await User.findOne({_id:userid})
const limitCheck = await timelimit.findOne({ userId: userid });

if (limitCheck) {
          return res.status(200).json({
            message: `Please wait 30sec seconds before trying again.`
          })  
      
    }
    const lastRequest =Date.now()
await timelimit.create({
    userId:userid,
    lastRequest
})
    userinfo.gameName[0].pubg = pubgName
    userinfo.uid[0].pubg = pubgUid
    await userinfo.save()
    return res.status(200).json({
        message:'saved successfully'
    })
}



const freefireprofile =async(req,res)=>{
    const{freefireName,freefireUid}=req.body
    if(!freefireName||!freefireUid){
        return res.status(400).json({
            message:'plz provide gameName'
        })
    }
    const userid =req.user
    const userinfo =await User.findOne({_id:userid})
    const limitCheck = await timelimit.findOne({ userId: userid });
    
    if (limitCheck) {
              return res.status(200).json({
                message: `Please wait 30sec seconds before trying again.`
              })  
          
        }
        const lastRequest =Date.now()
    await timelimit.create({
        userId:userid,
        lastRequest
    })
        userinfo.gameName[0].freefire = freefireName
        userinfo.uid[0].freefire = freefireUid
        await userinfo.save()
        return res.status(200).json({
            message:'saved successfully'
        })
}
const uploadImage =async(req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    console.log(req.file)
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
    });
  }

  const uploadimage =async(req,res)=>{
    const{image}=req.body
    const userid =req.user
    console.log(userid)
    const userinfo = await User.findOne({ _id: userid});
   console.log(userinfo)
   if(!userinfo){
    return res.status(400).json({
        message:'not user found'

    })
   }
   if(userinfo.image){
    userinfo.image = ""
   }
   userinfo.image=image
   await userinfo.save()
   console.log('save bhayo')
   res.status(200).json({
    message:'profile updated!!'
   })
  }
  const uploadproofclash =async(req,res)=>{
    const{proof,matchId}=req.body
    const userid =req.user
    const match = await ClashSquad.findOne({_id:matchId})
    const result = await ClashSquad.findOne(
        { 'teamopponent.userid': userid },
        { 'teamopponent.$': 1 }
    );
    const resulthost = await ClashSquad.findOne(
        { 'teamHost.userid': userid },
        { 'teamHost.$': 1 }
    );
    if(!result ||!resulthost){
        return res.status(404).json({
            message:'user not found'
        })
    }
   if(result){
    match.userProof=proof
   }
   if(resulthost){
    match.hostProof=proof
   }
   res.status(200).json({
    message:'profile updated!!'
   })
  }

  const uploadprooftdm =async(req,res)=>{
    const{proof,matchId}=req.body
    const userid =req.user
    const match = await tdm.findOne({_id:matchId})
    const result = await tdm.findOne(
        { 'teamopponent.userid': userid },
        { 'teamopponent.$': 1 }
    );
    const resulthost = await tdm.findOne(
        { 'teamHost.userid': userid },
        { 'teamHost.$': 1 }
    );
    if(!result ||!resulthost){
        return res.status(404).json({
            message:'user not found'
        })
    }
   if(result){
    match.userProof=proof
   }
   if(resulthost){
    match.hostProof=proof
   }
   res.status(200).json({
    message:'profile updated!!'
   })
  }
module.exports = {updateProfile,pubgprofile,freefireprofile,uploadImage,uploadimage,uploadproofclash,uploadprooftdm}