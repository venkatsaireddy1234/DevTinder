const jwtToken = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
           return res.status(401).send("Please login again");
        }
        const decodedVal = jwtToken.verify(token, process.env.JWT_SECRET);
        const {userId} = decodedVal;
        const user = await User.findById(userId);
        if(!user){
            throw new Error("Unauthorized: User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(401).send("Unauthorized access " + err.message);
    }
}

module.exports = {userAuth};