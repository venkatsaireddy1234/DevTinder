//import the express module
const express = require('express');

//create an app from the express module
const app = express();

// handle the requests for any routes
app.use("/home", (req, res)=>{
    res.send("this is the home page")
})

// this is the request handler
app.use((req,res)=>{
    res.send("handling the requestes")
})

// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})