const express = require('express')

const requestRouter  = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.get("/sendConnectionRequest",  userAuth, async(req,res) =>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("User not found");
        }
        res.send("Connection request sent successfully by " + user.firstName);
    }catch(err){
        res.status(500).send("Error in sending connection request" + err.message);
    }
})
 
module.exports = requestRouter;