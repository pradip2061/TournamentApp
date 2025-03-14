const {User} = require("../model/schema")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const ClashSquad = require("../model/ClashSquadModel")
const tdm = require("../model/TdmModel")
const changePassword=async(req,res)=>{
try {
const userid =req.user
const{oldPassword,newPassword}=req.body
if(!oldPassword || !newPassword){
    res.status(400).json({
        message:'plz fill the all field!'
    })
    return
}
const cleanUserId = userid.trim();
const objectId = new mongoose.Types.ObjectId(cleanUserId);
const NewPassword = await bcrypt.hash(newPassword,11)
const userinfo = await User.findById(objectId)
if(!userinfo){
    res.status(400).json({
        message:'user not user!'
    })
    return
}
const ispassword = await bcrypt.compare(oldPassword,userinfo.password)
if(!ispassword){
res.status(400).json({
    message:'oldPassword is wrong!'
})
return
}
userinfo.password = NewPassword
 await userinfo.save()
res.status(200).json({
    message:'password change successfully'
})
} catch (error) {
    res.status(400).json({
        message:error.message
    })
}
}

const customIdAndPassword=async(req,res)=>{
const{customId,customPassword,matchId}=req.body
const match = await ClashSquad.findOne({_id:matchId})
if(!match){
  return res.status(404).json({
    message:'matchCard not found'
  })
}
match.customId=customId
match.customPassword=customPassword
await match.save()

res.status(200).json({
    message:'data added successfully'
})
}

const customIdAndPasswordtdm=async(req,res)=>{
  const{customId,customPassword,matchId}=req.body
  const match = await tdm.findOne({_id:matchId})
  if(!match){
    return res.status(404).json({
      message:'matchCard not found'
    })
  }
  match.customId=customId
  match.customPassword=customPassword
  await match.save()
  
  res.status(200).json({
      message:'data added successfully'
  })
  }

const checkPublishOrNot = async (req, res) => {
    const { matchId } = req.body;
  
    // Validate input
    if (!matchId) {
      return res.status(400).json({ message: "Match ID is required" });
    }
  
    try {
      const match = await ClashSquad.findOne({ _id: matchId });
  
      // If match is not found
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
  
      // Check if match is published
      if (!match.customId || !match.customPassword) {
        return res.status(200).json({ message: "notpublish" });
      }
  
      res.status(200).json({ message: "publish" });
    } catch (error) {
      console.error("Error fetching match:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const checkPublishOrNotTdm = async (req, res) => {
    const { matchId } = req.body;
    console.log(matchId)
    // Validate input
    if (!matchId) {
      return res.status(400).json({ message: "Match ID is required" });
    }
  
    try {
      const match = await tdm.findOne({ _id: matchId });

      // If match is not found
      if (!match) {
        console.log("hello sir")
        return res.status(404).json({ message: "Match not found" });
      }
  
      // Check if match is published
      if (!match.customId || !match.customPassword) {
        return res.status(200).json({ message: "notpublish" });
      }
  
      res.status(200).json({ message: "publish" });
    } catch (error) {
      console.error("Error fetching match:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const reset =async(req,res)=>{
 try {
  const{matchId,customId,customPassword}=req.body
 const match = await ClashSquad.findOne({_id:matchId})
 if(!match){
   return res.status(400).json({message:'no matchcard found'})
 }
    match.customId = customId  
    match.customPassword=customPassword
    await match.save()
    res.status(200).json({message:'customPassword changed!'})
 } catch (error) {
  console.log(error)
 }
 }

const resettdm =async(req,res)=>{
  try {
    const{matchId,customId,customPassword}=req.body
  const match = await tdm.findOne({_id:matchId})
  if(!match){
    return res.status(400).json({message:'no matchcard found'})
  }
  match.customId = customId  
    match.customPassword=customPassword
    await match.save()
    res.status(200).json({message:'customPassword changed!'})
  } catch (error) {
    console.log(error)
  }
 }
module.exports={changePassword,resettdm,customIdAndPassword,customIdAndPasswordtdm,checkPublishOrNot,reset,checkPublishOrNotTdm}