const express = require('express');

const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditFields} = require('../utils/validatations');

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
            const user = req.user;
            res.send(user);
    }
    catch(err){
        res.status(500).send("Error in fetching profile" + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const isValidEditFields = await validateEditFields(req.body);
        if(!isValidEditFields){
            throw new Error("Invalid edit fields");
        }else{
            Object.keys(req.body).forEach((key)=> {loggedInUser[key] = req.body[key]});
            await loggedInUser.save();
            res.send({message: "Your Profile Edit has been Successfully Done", user: loggedInUser});
        }
    }catch(err){
        res.status(500).send("Error in updating profile" + err.message);
    }
})

module.exports = profileRouter;