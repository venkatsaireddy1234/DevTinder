const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        min:4,
        max: 10
    },
    lastName :{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        min:8,
        validate:{
            validator: function(value){
                //password must contain at least one uppercase letter, one lowercase letter, one digit and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
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
        type: [String]
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;