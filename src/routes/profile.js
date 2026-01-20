const express = require('express');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditFields, validatePasswordChange} = require('../utils/validatations');

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

profileRouter.patch('/profile/changepassword', userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const { newPassword} = req.body;
        const isValidatePasswordChange = await validatePasswordChange(req);
        if(!isValidatePasswordChange){
            throw new Error("Password Change Validation Failed");
        }
        else{
            // Hash the new password before saving
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            loggedInUser.password = hashedPassword;
            await loggedInUser.save();
            res.send({message:"Password Changed Successfully"})
        }
    }catch(err){
        res.status(500).send("Error in changing password: " + err.message);
    }
})

module.exports = profileRouter;