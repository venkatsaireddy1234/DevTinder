//import the express module
const express = require('express');

//create an app from the express module
const app = express();

const { userMiddleware } = require('./middlewares/auth')

app.use(express.json()); // for parsing application/json

// next() is usually useful when we need to handle middlewares
// we can write the middleware in the first end point and pass it to the second route handler as below
// or we can write the middleware globally and import it and use it in the app and it works the same way
// using the middleware for only specific routes 

// if we use the userMiddlware at the beginning then whatever the route handlers we write all the rooutes 
// will go through these middlewares as below user login won't be needing the middleware check but it checks, thats wrong
app.use('/user',userMiddleware)
app.get("/user/login",(req,res,next)=>{
    try {
        const userEmail = req.body.email;
        
        if (!userEmail) {
            throw new Error("Email is required for login")
        }
        
        res.send("User Logged in successfully")
    } catch (err) {
        next(err)
    }
})
app.get("/user", (req,res)=>{
    res.send("user data and checked in the above middleware")
})

// Global error handling middleware (add at the end, before app.listen)
app.use((err, req, res, next) => {
    console.log("Error caught:", err.message)
    res.status(400).send({
        success: false,
        message: err.message
    })
})


// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})