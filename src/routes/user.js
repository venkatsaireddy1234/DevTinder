const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();

const columns = ["firstName", "lastName", "skills", "age"]
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestsRecieved = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", columns);

    res
      .status(200)
      .json({
        success: true,
        message: "Requests fetched successfully",
        connectionRequestsRecieved,
      });
  } catch (err) {
    res.status(400).send("Something Went Wrong " + err.message);
  }
});
userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestsSent = await ConnectionRequestModel.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId",columns );

    res
      .status(200)
      .json({
        success: true,
        message: "Send Requests fetched Successfully",
        connectionRequestsSent,
      });
  } catch (err) {
    res.status(400).send("Something Went Wrong " + err.message);
  }
});

userRouter.get("/user/requests/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const myConnections = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId", columns).populate("toUserId", columns);

    //write a logic if fromuserId or touserid is loggedIn user._id then don't add it in the mycoinnections
    const filteredConnections = myConnections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        // Return only the toUser (the other person)
        return connection.toUserId;
      } else {
        // Return only the fromUser (the other person)
        return connection.fromUserId;
      }
    });
    res.status(200).json({success:true, message: "Fetched your connections successfully", filteredConnections})
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});
module.exports = userRouter;
