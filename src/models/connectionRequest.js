const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: {
            values :["ignored", "interested", "rejected", "accepted"],
            message: '{VALUE} is not supported'
        }
    }
},
{timestamps: true});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;