//import the express module
const express = require('express');

//create an app from the express module
const app = express();



//playing with the same end point with the different route handlers
//In order to execute the multiple route handlers we need to use next() function  
// but here once we send the response in the 15th line it stops executes the next route handler
app.use("/user", 
    (req,res, next)=>{
    console.log("This is the first route handler")
    res.send("1st route handler")
    next()
    },
    (req, res, next) =>{
    console.log("This is the second route handler")
    res.send("2nd route handler")
    next()
    }   
)



// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})