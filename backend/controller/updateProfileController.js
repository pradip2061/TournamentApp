const ClashSquad = require("../model/ClashSquadModel")
const RateLimit = require("../model/RateLimitModel")
const {User} = require("../model/schema")
const tdm = require("../model/TdmModel")
const timelimit = require("../model/TimeLimitModel")
const mongoose =require('mongoose')
const updateProfile =async(req,res)=>{
    const userid =req.user
    const {username}=req.body
 const userinfo =await User.findOne({_id:userid})
 const limit =await RateLimit.findOne({userId:userid})

 if(limit){
   const Timeleft=  Date.now() -limit.lastRequest
   const twoHoursInMs = 2 * 60 * 60 * 1000;
   const remainingTime = twoHoursInMs -Timeleft
   const value = remainingTime/(1000*60*60)
   const minuteTime = value.toFixed(2)
return res.status(200).json({
    message:`you can update after ${minuteTime} hours`
})
 }
 userinfo.username =username
 const requestCount =1
 const lastRequest = Date.now()
await RateLimit.create({
    userId:userid,
    requestCount,
    lastRequest
})
 await userinfo.save()

 res.status(200).json({
    message:"update successfully"
 })
}

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