//import the express module
const express = require('express');

//create an app from the express module
const app = express();



// next() is usually useful when we need to handle middlewares
// we can write the middleware in the first end point and pass it to the second route handler as below
app.use('/user', (req,res,next)=>{
    const token = "token";
    const isAuthUser = token === "token";
    console.log("checking the authorization")
    if(isAuthUser){
        next()
    }else{
        res.status(403).send("Unauthorised User")
    }
})
app.get("/user", (req,res)=>{
    res.send("user data and checked in the above middleware")
})



// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})