const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        min:5,
        max: 50,
        required: true
    },
    lastName :{
        type: String,
    },
    email:{
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
        
    },
    password:{
        type: String,
        required: true,
        min:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age:{
        type:Number,
        min : 16,
    },
    gender:{
        type: String,
        validate:{
            validator: function(value){
                if(!['Male', 'Female', 'Other'].includes(value)){
                    throw new Error(`${value} is not a valid gender`);
                }
            },
        }
    },
    photoUrl:{
        type: String
    },
    country:{
        type: String,
        default: "India"
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length > 10){
                throw new Error("Skills cannot exceed 10");
            }
        }
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;