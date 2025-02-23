const ClashSquad = require("../model/ClashSquadModel");
const FFfreefire = require("../model/FullMatchFFModel");
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
      teamHost: [{ userid: userId }], 
      teamopponent: [{userid:"",}],
      status: "pending",
      customId:null,
      customPassword:null
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
 
  const user = await signUp.findOne({_id:userid})
  if(!user){
    res.status(404).json({
      message:'user not found'
    })
  }


const userinfo = await signUp.findOne({_id:userid})
const match = await ClashSquad.findOne(
  { _id: matchId}, // Find where userid is null
);
if(userinfo.balance >= match.matchDetails[0].betAmount){
  return res.status(200).json({
    message:'you haven`t enough balance'
  })
}
user.matchId = matchId
user.isplaying=true
user.save()

userinfo.balance -= match.matchDetails[0].betAmount
 await userinfo.save()
match.teamopponent[0].userid=userid
 await match.save()
  res.status(200).json({
    message:'join successfully'
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

const checkisplaying =async(req,res)=>{
  try {
    const userId = req.user; 
    const user = await signUp.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isplaying === true) {
      return res
        .status(400)
        .json({ message: "previous is running you can't setup matches" });
    }
    return res.status(200).json({
      message: "You are validated",
    });
}catch(error){
  console.error("Error fetching user:", error);
}

}

const createFF = async (req, res) => {
  try {
    const { playermode, gameName,entryFee } = req.body;

    // Create a new match document
    const match = await FFfreefire.create({ playermode, gameName,entryFee});

    // Fetch all matches
    const matches = await FFfreefire.find();

    // Function to count total players across all matches
    const countPlayers = (games) => {
      return games.reduce((total, game) => total + game.gameName.reduce((sum, playersArray) => sum + playersArray.length, 0), 0);
    };

    // Calculate total players
    const total = countPlayers(matches);

    // Update each match document with the correct TotalPlayer count
    await FFfreefire.updateMany({}, { $set: { TotalPlayer: total } });

    res.status(200).json({
      message: "Created successfully",
      match,
      totalPlayers: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFFmatch = async (req, res) => {
  try {
   const card =  await FFfreefire.find({ status: { $in: ["pending", "running"] } })
    .sort({ createdAt: -1 }); 
    res.status(200).json({
      card
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const joinuserff =async(req,res)=>{
  const userid =req.user
  const{matchId}=req.body
  const userinfo =await signUp.findOne({_id:userid})
  const match = await FFfreefire.findOne({_id:matchId})
  if(userinfo.balance >= match.entryFee)
    userinfo.balance -= match.entryFee
  userinfo.isplaying = true
  userinfo.matchId = matchId
  match.userid.push(userid)
  await match.save()
  await userinfo.save()
  res.status(200).json({
    message:'user join successfully'
  })
}

module.exports = {createCs,getCsData,playingmatch,joinuser,trackusermodel,checkUserOrAdmin,joinuserff,checkisplaying,getFFmatch,createFF};
