//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');
require("dotenv").config();


const cookieParser = require('cookie-parser');
const cors = require('cors')
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
//create an app from the express module
const app = express();
app.set("trust proxy", 1);


// Inorder to avoid cors issue that is it won't allow us to send one ip address to another 
// const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions))
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
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

connectDB().then(()=>{
    console.log("DB connected successfully");
    const PORT = process.env.PORT || 7777;
    app.listen(PORT, "0.0.0.0", ()=>{
        console.log("server is listening on port no " + PORT)
    })
}).catch((err)=>{
    console.log("DB connection failed", err);
})
