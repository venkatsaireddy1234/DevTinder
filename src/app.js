//import the express module
const express = module('express');

//create an app from the express module
const app = express();

// accept the requests or listen to the requests 
app.listen(3000, ()=>{
    console.log("server is listening on port no 3000")
})

// this is the request handler
app.use((req,res)=>{
    console.log("handling the requestes")
})


// handle the requests for any routes
app.use('/home', (req, res)=>{
    console.log("this is the home page")
})