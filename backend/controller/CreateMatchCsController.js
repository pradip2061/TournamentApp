const ClashSquad = require("../model/ClashSquadModel");

const createCs = async (req, res) => {
  const {gameName, matchDetails } = req.body;
const userId = req.user
  if (!userId || !gameName || !matchDetails || !Array.isArray(matchDetails)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const newMatch = new ClashSquad({
      matchDetails: matchDetails, 
      teamHost: [{ userid: userId, gameName: gameName }], 
      teamopponent: [],
      teamHostStatus: false,
      team2Status: false,
      status: "pending",
    });
    await newMatch.save();
    res.status(200).json({ message: "Match created successfully!", match: newMatch });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getCsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;

    // Get total matches count
    const totalMatches = await ClashSquad.aggregate([
      { $unwind: "$matchDetails" }, // Flatten the matchDetails array
      { $count: "totalMatches" } // Count all matchDetails objects
    ]);

    const totalPages = totalMatches.length > 0 ? Math.ceil(totalMatches[0].totalMatches / perPage) : 1;

    if (page > totalPages) {
      return res.status(404).json({
        message: 'Data is up to date'
      });
    }

    // Get paginated data
    const card = await ClashSquad.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      card,
      totalMatches: totalMatches.length > 0 ? totalMatches[0].totalMatches : 0,
      totalPages,
      page
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {createCs,getCsData};
