const PubgFull = require("../model/PubgFullMatchModel");
const {User} = require("../model/schema");
const tdm = require("../model/TdmModel");
const namelimit = require("../model/updateNameLimit");

const joinuserPubg = async (req, res) => {
  const userid = req.user;
  const { matchId } = req.body;
  const userinfo = await User.findOne({ _id: userid });
  const match = await PubgFull.findOne({ _id: matchId });
  if (userinfo.balance >= match.entryFee) {
    userinfo.balance -= match.entryFee;
  userinfo.matchId.pubgFullId.push(matchId)
  match.userid.push(userid);
  if(!userinfo.gameName[0].pubg){
    return res.status(400).json({
      message:'add pubgGameName in your profile'
    })
  }
  const objectcount = match.gameName.reduce((count,obj)=>count +Object.keys(obj),0)
  const slot = objectcount+1
  match.gameName.push({userid:userid,player1:userinfo.gameName[0].pubg ,player2:'',player3:'',player4:'',slot:slot})
  // match.TotalPlayer +=1
  await match.save();
  await userinfo.save();
  res.status(200).json({
    message: "user join successfully",
  });
}else{
  res.status(400).json({
    message: "you don't have enough balance",
  });
}
};
const getpubgMatch = async (req, res) => {
  try {
    const card = await PubgFull.find({
      status: { $in: ["pending", "running"] },
    }).sort({ createdAt: -1 });
    res.status(200).json({
      data: card,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const checkuserJoinPubg = async (req, res) => {
  try {
    const { matchId } = req.body;
    const userid = req.user;

    // Fetch user information
    const userinfo = await User.findOne({ _id: userid });

    // Handle if user not found
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure matchId and pubgFullId exist
    const gameNameArray = userinfo.matchId?.pubgFullId || [];

    // Check if matchId exists in the array
    const index = gameNameArray.findIndex(arr => arr.includes(matchId));

    res.status(200).json({
      message: index !== -1 ? "joined" : "notjoined",
    });
  } catch (error) {
    console.error("Error in checkuserJoinPubg:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const checkuserJoinPubgtdm = async (req, res) => {
  try {
    const { matchId } = req.body;
    const userid = req.user;

    // Fetch user information
    const userinfo = await User.findOne({ _id: userid });

    // Handle if user not found
    if (!userinfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure matchId and pubgFullId exist
    const gameNameArray = userinfo.matchId?.pubgTdmId || [];
    // Check if matchId exists in the array
    const index = gameNameArray.findIndex(arr => arr.includes(matchId));

    res.status(200).json({
      message: index !== -1 ? "joined" : "notjoined",
    });
  } catch (error) {
    console.error("Error in checkuserJoinPubg:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPubgMatch = async (req, res) => {
  const { playermode, entryFee,time } = req.body;
  const userid = req.user;
  if (!playermode || !time || !entryFee) {
    return res.status(400).json({
      message: "all fields are mandatory",
    });
  }
  await PubgFull.create({
    playermode,
    entryFee,
    userid,
    time
  });
  res.status(200).json({
    message:'match create successfully'
  })
};


const addName = async(req, res) => {
  try {
    const { player1, player2, player3,player4, matchId } = req.body;
  const userid = req.user;
  // Validate input
  if (!player2 || !player3 || !player4 ||!player1) {
    return res.status(400).json({ message: 'All fields are mandatory' });
  }
  // Check if match exists
  
  const matchinfo = await PubgFull.findOne({_id: matchId });
  const userinfo = await User.findOne({ _id: userid });
  if (!userinfo || !userinfo.gameName || !userinfo.gameName[0]?.pubg) {
    return res.status(400).json({ message: 'Please set your gameName from your first' });
  }
  if (!matchinfo) {
    return res.status(400).json({ message: 'No match found' });
  }

  // Check rate limit (2-hour restriction)
  const checklimit = await namelimit.findOne({ matchId, userid });
  if (checklimit) {
    return res.status(400).json({ message: 'You can try again after 2 hours.' });
  }

  await namelimit.create({
    userid,
    matchId,
    lastRequest: Date.now()
  });
  const teamIndex = matchinfo.gameName.findIndex((team) => team.userid === userid);
  matchinfo.gameName[teamIndex].player1 =player1
  matchinfo.gameName[teamIndex].player2 =player2
  matchinfo.gameName[teamIndex].player3 =player3
  matchinfo.gameName[teamIndex].player4 =player4
  const totalStrings = matchinfo.gameName.reduce((acc, obj) => acc + Object.keys(obj).length, 0);
  matchinfo.TotalPlayer = totalStrings
  await matchinfo.save()
  res.status(200).json({ message: 'Set successfully' });
  } catch (error) {
    console.log(error)
  }
};

const createtdm =async(req,res)=>{
  const{matchDetails}=req.body // Correctly adds 6 minutes
  const userid =req.user
  const userinfo = await User.findOne({_id:userid})
  if(userinfo.balance < matchDetails.betAmount){
    return res.status(400).json({
      message:'you dont have enough balance'
    })
  }
  if(!userinfo.gameName[0].pubg){
    return res.status(400).json({
      message:'add pubgGameName in your profile'
    })
  }
  const newMatch = new tdm({
   playermode:matchDetails.match,
  entryFee:matchDetails.betAmount,
  gameName:matchDetails.gameName,
  teamHost: [{ userid: userid }],
  teamopponent: [{ userid: "" }],
      userProof:"",
      hostProof:"",
    TotalPlayers:1
      });

      await newMatch.save()
      userinfo.balance -= matchDetails.betAmount
      userinfo.save()
res.status(200).json({
  message:'match create successfully',
  newMatch
})
}

const gettdm =async(req,res)=>{
  try {
    const card = await tdm.find({
      status: { $in: ["pending", "running"] },
    }).sort({ createdAt: -1 });
    res.status(200).json({
      data: card,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

const joinuserPubgtdm = async (req, res) => {
  const userid = req.user;
  console.log(userid)
  const { matchId } = req.body;
  const userinfo = await User.findOne({ _id: userid });
  const match = await tdm.findOne({ _id: matchId });
  if (userinfo.balance >= match.entryFee) {
    userinfo.balance -= match.entryFee;
  userinfo.matchId.pubgTdmId.push(matchId)
  
  if(!userinfo.gameName[0].pubg){
    return res.status(400).json({
      message:'add pubgGameName in your profile'
    })
  }
  match.teamopponent[0].userid=userid
  match.TotalPlayers +=1
  await match.save();
  await userinfo.save();
  res.status(200).json({
    message: "user join successfully",
  });
}else{
  res.status(400).json({
    message: "you don't have enough balance",
  });
}
};

const addNametdm = async (req, res) => {
  try {
    const { player1, player2, player3, matchId } = req.body;
  const userid = req.user;

  // Validate input
  if (!player1 || !player2 || !player3) {
    return res.status(400).json({ message: 'All fields are mandatory' });
  }

  // Check if match exists
  const matchinfo = await tdm.findOne({ _id: matchId });
  const userinfo = await User.findOne({_id:userid})
  const gameName = userinfo.gameName[0].pubg
  if(!gameName){
    return res.status(400).json({
      message:'plz set your gameName from your profile'
    })
  }
  if (!matchinfo) {
    return res.status(400).json({ message: 'No match found' });
  }

  // Check rate limit (2-hour restriction)
  const checklimit = await namelimit.findOne({ matchId, userid });
  if (checklimit) {
    return res.status(400).json({ message: 'You can try again after 2 hours.' });
  }

  // Save the request timestamp with a TTL index (2 hours)
  await namelimit.create({
    userid,
    matchId,
    lastRequest: Date.now()
  });

  // ✅ Choose one:
  // matchinfo.gameName.push(player1, player2, player3);  // Append names
  const team = matchinfo.gameName.filter((item)=>item.player1 === gameName)
team[0].player2 = player1
team[0].player3 = player2
team[0].player4 = player3
  const totalStrings = matchinfo.gameName.reduce((acc, obj) => acc + Object.keys(obj).length, 0);
  matchinfo.TotalPlayer = totalStrings
  matchinfo.save()

  res.status(200).json({ message: 'Set successfully' });
  } catch (error) {
    console.log(error)
  }
};
module.exports = { joinuserPubg, getpubgMatch, checkuserJoinPubg,createPubgMatch,addName,addNametdm,createtdm,gettdm,joinuserPubgtdm ,checkuserJoinPubgtdm};
