const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const validateSignUp =(req) =>{
    const {firstName, lastName, email, password, age, skills} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and Last name are required");
    }else if( firstName.length <5 || firstName.length > 50){
        throw new Error("First name must be between 5 and 50 characters");
    }else if (!validator.isEmail(email)){
        throw new Error("Email is invalid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }else if(age && age < 16){
        throw new Error("Age must be at least 16");
    }else if(skills && skills.length > 10){
        throw new Error("Skills cannot exceed 10");
    }
}

const validateEditFields = (req) =>{
    const allowedEditFields = ['firstName', 'lastName', 'age', 'skills', 'about'];
    const isValidEdit = Object.keys(req).every((field)=> allowedEditFields.includes(field));
    if(!isValidEdit){
        throw new Error("Invalid edit fields");
    }
    return isValidEdit;
}

const validatePasswordChange = async (req) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const loggedInUser = req.user;
    
    // bcrypt.compare() returns true/false, not the password
    const isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
    if(!isPasswordValid){
        throw new Error("Your old password is incorrect");
    }else if(!oldPassword || !newPassword || !confirmPassword){
            throw new Error("All password fields are required");
    }else if(newPassword !== confirmPassword){
        throw new Error("New Password and Confirm Password should match");
    }else if(!validator.isStrongPassword(newPassword)){
        throw new Error("New password is not strong enough");
    }else{
        return true;
    }
}

module.exports = {validateSignUp, validateEditFields, validatePasswordChange};