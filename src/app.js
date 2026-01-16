//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');
//create an app from the express module
const app = express();


connectDB().then(()=>{
    console.log("DB connected successfully");
    app.listen(7777, ()=>{
        console.log("server is listening on port no 7777")
    })
}).catch((err)=>{
    console.log("DB connection failed", err);
})


