const ClashSquad = require("../model/ClashSquadModel");

const createCs = async (req, res) => {
  const {matchDetails} = req.body
const userId = req.user
  if (!userId ||  !matchDetails) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const newMatch = new ClashSquad({
      matchDetails: matchDetails, 
      teamHost: [{ userid: userId,  teamHostStatus: false, }], 
      teamopponent: [{userid:"",team2Status: false,}],
      status: "pending",
    });
    await newMatch.save();
    res.status(200).json({ message: "Match created successfully!"});
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

module.exports = {createCs,getCsData};
