//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');


const cookieParser = require('cookie-parser');
const {userAuth} = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
//create an app from the express module
const app = express();

// express.json() line converts the response into json format
app.use(express.json());
// cookieParser()  parses the request for the following endpoints 
app.use(cookieParser())


app.use("/", authRouter);
app.use("/", profileRouter);


app.get("/sendConnectionRequest",  userAuth,async(req,res) =>{
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

connectDB().then(()=>{
    console.log("DB connected successfully");
    app.listen(7777, ()=>{
        console.log("server is listening on port no 7777")
    })
}).catch((err)=>{
    console.log("DB connection failed", err);
})


