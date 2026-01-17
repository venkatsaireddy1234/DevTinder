const validator = require('validator');


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


module.exports = {validateSignUp};