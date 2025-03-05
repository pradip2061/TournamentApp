const express = require("express");
const router = express.Router();

const { User } = require("../../model/schema"); // Use destructuring if multiple exports exist

router.get("/khelmela/:request/:id", async (req, res) => {
  console.log("Route Active >>>>>>>>>>>>>>>>>>>>>>>>>>>");
  try {
    const { id, request } = req.params;

    console.log(typeof id, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

    // If request is "user", return user by id
    if (request === "user") {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user); // Return the full user data
    }

    // Otherwise, attempt to populate the specified field
    const user = await User.findById(id).populate(request);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the field being populated is an array (e.g., friends)
    if (Array.isArray(user[request])) {
      return res.json(user[request]); // Send the populated field (friends array)
    } else {
      return res.status(400).json({ message: `${request} is not an array` });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/khelmela/admin/updateUser/:adminId/:userId", async (req, res) => {
  console.log("route Active >>>>>>>>>>>>>>>>>>>>>>>>>> ");
  try {
    const { adminId, userId } = req.params;
    const updateData = req.body; // Get the fields to update from the request body

    // Verify if adminId is valid and user is an admin
    const admin = await User.findById(adminId).lean();
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized Request" });
    }

    // Update the single user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Update multiple fields
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Unauthorized Request", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
