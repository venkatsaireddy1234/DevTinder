const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");
const columns = [
  "firstName",
  "lastName",
  "skills",
  "photoUrl",
  "age",
  "about",
  "gender",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestsRecieved = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", columns);

    res.status(200).json({
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
    }).populate("toUserId", columns);

    res.status(200).json({
      success: true,
      message: "Send Requests fetched Successfully",
      connectionRequestsSent,
    });
  } catch (err) {
    res.status(400).send("Something Went Wrong " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", columns);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // we should not show the users who have sent the connections to loggedInUser
    // we should not show the loggedInUser also
    // we will get all the connections and filter out from the users document

    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // filter out the only ids using set
    const hiddenFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenFromFeed.add(req.fromUserId.toString());
      hiddenFromFeed.add(req.toUserId.toString());
    });
    const allUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(columns)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      message: "Fetched your feed successfully",
      allUsers,
    });
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

module.exports = userRouter;
