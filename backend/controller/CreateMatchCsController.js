const ClashSquad = require("../model/ClashSquadModel");

const createCs = async (req, res) => {
  const { matchDetails } = req.body;
  const userId = req.user

  // Check if the required fields are provided
  if (!userId || !matchDetails) {
    return res.status(400).json({
      message: "User ID and match details are required.",
    });
  }

  try {
    // Check if the user already exists in the database
    const userExists = await ClashSquad.findOne({ userid:userId });

    if (!userExists) {
      // Create a new document if user doesn't exist
      await ClashSquad.create({
        userid:userId,
        matchDetails:[matchDetails]
      });

      return res.status(200).json({
        message: "Match Create successfully!!",
      });
    } else {
      // Push the new match details to the existing user's matchDetails array
      userExists.matchDetails.push(matchDetails); 

      // Save the updated document
      await userExists.save();

      return res.status(200).json({
        message: "Match create successfully!!",
      });
    }
  } catch (error) {
    console.error("Error handling createCs:", error);
    res.status(500).json({
      message: "Internal server error.",
      details: error.message,
    });
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
