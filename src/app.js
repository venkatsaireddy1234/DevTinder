//import the express module
const express = require('express');

//create an app from the express module
const app = express();



//playing with the same end point with the different route handlers
//In order to execute the multiple route handlers we need to use next() function  
// but here once we send the response in the 15th line it stops executes the next route handler
// so  we cannot send the multiple responses for a single end point we may skip at first route handler to see the second route handler resonse
//what if we use next() before even sending the resonse of the first route handler?
// It doesn't break because the first route handler executes the second route handler before 
// responding the first route handler because of the next() and it never executes the first route handler
//  with the response because no end point can have two responses
// we can pass the array of route handlers as well to the same end point
app.use("/user", 
    [(req,res, next)=>{
    console.log("This is the first route handler")
    res.send("1st route handler")
    next()
    },
    (req, res, next) =>{
    console.log("This is the second route handler")
    res.send("2nd route handler")
    next()
    }] 
)



// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})