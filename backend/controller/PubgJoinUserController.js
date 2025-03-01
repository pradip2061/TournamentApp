const PubgFull = require("../model/PubgFullMatchModel");
const signUp = require("../model/signUpModel");
const tdm = require("../model/TdmModel");
const namelimit = require("../model/updateNameLimit");

const joinuserPubg = async (req, res) => {
  const userid = req.user;
  const { matchId } = req.body;
  const userinfo = await signUp.findOne({ _id: userid });
  const match = await PubgFull.findOne({ _id: matchId });
  if (userinfo.balance >= match.entryFee) {
    userinfo.balance -= match.entryFee;
  userinfo.matchId.push(matchId)
  match.userid.push(userid);
  if(!userinfo.gameName[0].pubg){
    return res.status(400).json({
      message:'add pubgGameName in your profile'
    })
  }
  const objectcount = match.gameName.reduce((count,obj)=>count +Object.keys(obj),0)
  const slot = objectcount+1
  match.gameName.push({userid:userid,player1:userinfo.gameName[0].pubg ,player2:'',player3:'',player4:'',slot:slot})
  match.TotalPlayer=1
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
  const { matchId } = req.body;
  const userid = req.user;
  const userinfo = await signUp.findOne({ _id: userid });
  const gameNameArray = userinfo.matchId
  const index = gameNameArray.findIndex(arr => arr.includes(matchId));
  if (index !== -1) {
    res.status(200).json({
      message: "joined",
    });
  }else {
    res.status(200).json({
      message: "notjoined",
    });
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


const addName = async (req, res) => {
  try {
    const { player1, player2, player3, matchId } = req.body;
  const userid = req.user;

  // Validate input
  if (!player1 || !player2 || !player3) {
    return res.status(400).json({ message: 'All fields are mandatory' });
  }

  // Check if match exists
  const matchinfo = await PubgFull.findOne({ _id: matchId });
  const userinfo = await signUp.findOne({_id:userid})
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

const createtdm =async(req,res)=>{
  const{playermode,TotalPlayer,Time,entryFee}=req.body
await tdm.create({
  playermode,
  TotalPlayer,
  Time,
  entryFee,
})
res.status(200).json({
  message:'match create successfully'
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
  const userinfo = await signUp.findOne({ _id: userid });
  const match = await tdm.findOne({ _id: matchId });
  if (userinfo.balance >= match.entryFee) {
    userinfo.balance -= match.entryFee;
  userinfo.matchId.push(matchId)
  match.userid.push(userid);
  if(!userinfo.gameName[0].pubg){
    return res.status(400).json({
      message:'add pubgGameName in your profile'
    })
  }
  const objectcount = match.gameName.reduce((count,obj)=>count +Object.keys(obj),0)
  const slot = objectcount+1
  match.gameName.push({userid:userid,player1:userinfo.gameName[0].pubg ,player2:'',player3:'',player4:'',slot:slot})
  match.TotalPlayer=1
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
  const userinfo = await signUp.findOne({_id:userid})
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
module.exports = { joinuserPubg, getpubgMatch, checkuserJoinPubg,createPubgMatch,addName,addNametdm,createtdm,gettdm,joinuserPubgtdm};
