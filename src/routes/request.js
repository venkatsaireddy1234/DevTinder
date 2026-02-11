const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // check to User exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }

      // we need to check the status also, status should be only whether ignored or interested
      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status type:" + status);
      }

      // before sending we will check whether the request exists or not
      // We are using $or operator to check the connection vice versa in the db
      // otherwise it will be duplicate connection
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      
      if (existingConnectionRequest) {
        throw new Error("Already sent the connection request before");
      }

      // we are sending the connection request to the toUserID and
      // so we will call the connection Schema and send the appropriate Fields
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.status(200).json({
        message: user.firstName + " is " + status + " in " + toUser.firstName,
        data,
        success: true,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) =>{
    try{
        //status should be only allowed
        const {status, requestId} = req.params;
        const loggedInUser = req.user
        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            throw Error ("Status not allowed");
        }
        // requestId should be present in the db (DB call)
        //whoever accepting the request should be loggedIn user(DB call that is in the DB 
        // call we have stored the toUserId while sending the request that toUserId should be loggedIn user)
        // status of that should be interested nor ignored or anything

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            throw Error ("Invalid Connection Request");
        }
        //if everything is good then change the status in the connectionRequest and save it 
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({message:"Request Accepted Succuesfully"})
    }catch(err){
        res.status(400).send("Something Went Wrong " + err.message)
    }
})


module.exports = requestRouter;