//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');


const cookieParser = require('cookie-parser');
const cors = require('cors')
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
//create an app from the express module
const app = express();


// Inorder to avoid cors issue that is it won't allow us to send one ip address to another 
const corsOptions = {origin :"http://localhost:5173", credentials: true}
app.use(cors(corsOptions))
// express.json() line converts the response into json format
// Increase limit to allow base64 image strings from profile updates
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// cookieParser()  parses the request for the following endpoints 
app.use(cookieParser())


app.use("/", authRouter);
app.use("/", profileRouter);
app.use('/', requestRouter)
app.use("/", userRouter)

connectDB().then(()=>{
    console.log("DB connected successfully");
    app.listen(7777, ()=>{
        console.log("server is listening on port no 7777")
    })
}).catch((err)=>{
    console.log("DB connection failed", err);
})

