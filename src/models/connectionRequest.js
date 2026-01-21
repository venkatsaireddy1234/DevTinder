const mongoose = require("mongoose");

//Connection request schema
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{values} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//we need to create a compound index for both fromUserId and toUserId because the finding entry will be expesnsive 
//at every time user send connection request we will check the db
// Index : 1 meaning it will create index in ascending order

connectionRequestSchema.index({fromUserId:1, toUserId:1})

//before saving the req, we need to check whether the user is sending the re to himself/herself or to any other user

connectionRequestSchema.pre("Save", function (next) {
  const connectionRequest = this;

  //check is fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = {
  ConnectionRequestModel,
};