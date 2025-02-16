const ClashSquad = require("../model/ClashSquadModel");
const signUp = require("../model/signUpModel");

const createCs = async (req, res) => {
  const { matchDetails } = req.body;
const userId = req.user
  if (!userId ||  !matchDetails) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const userinfo = await signUp.findOne({_id:userId})
    if(!userinfo){
      res.status(200).json({
        message:'user not found'
      })
    }
    const newMatch = new ClashSquad({
      matchDetails: matchDetails, 
      teamHost: [{ userid: userId,  teamHostStatus: false, }], 
      teamopponent: [{userid:"",team2Status: false,}],
      status: "pending",
    });
    await newMatch.save();
    userinfo.isplaying= true
    userinfo.save()
    res.status(200).json({ message: "Match created successfully!",newMatch});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getCsData = async (req, res) => {
  try {
   const card =  await ClashSquad.find({ status: { $in: ["pending", "running"] } })
    .sort({ createdAt: -1 }); 
    res.status(200).json({
      card
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const playingmatch = async(req,res)=>{
  const userId = req.user
  const data = await signUp.findById(userId).populate("matchId")
  res.status(200).json({
    message:'data is sent ',
    data:data
  })
}

const joinuser = async(req,res)=>{
  const userid = req.user
  const {matchId}=req.body
  const matchcard = await ClashSquad.findOne({_id:matchId})
  matchcard.teamopponent.userid = userid
  matchcard.save()
  const match = await signUp.findOne({_id:userid})
  if(!match){
    res.status(404).json({
      message:'user not found'
    })
  }
match.matchId = matchId
match.isplaying=true
match.save()
  res.status(200).json({
    message:'userid add successfully'
  })
}

const trackusermodel = async(req,res)=>{
  const{matchId}=req.body
  const userid = req.user
  if(!matchId){
    return res.status(400).json({
      message:'all fields are required'
    })
  }
const match = await signUp.findOne({_id:userid})

match.matchId = matchId
await match.save()
res.status(200).json({
  message:'matchid add successfully'
})
}

const checkUserOrAdmin =async(req,res)=>{
 const userId = req.user
 const{matchId}=req.body
 if(!matchId){
  return res.status(400).json({
    message:'something error'
  })
 }
 const matchCard = await ClashSquad.findOne({_id:matchId, teamHost: { $elemMatch: { userid: userId } },})
if( matchCard){
   return res.status(200).json({
    message:'host'
  })
}else if(!matchCard){
  const userjoined = await ClashSquad.findOne({_id:matchId,teamopponent: { $elemMatch: { userid: userId } },})
  if(userjoined){
    return res.status(200).json({
      message:'userjoined'
    })
  }else{
    return res.status(200).json({
      message:'user'
    })
  }
}
}


module.exports = {createCs,getCsData,playingmatch,joinuser,trackusermodel,checkUserOrAdmin};
