//import the express module
const express = require('express');

//create an app from the express module
const app = express();



app.get('/user', (req,res) =>{
    res.send("Getting the users")
})

app.post('/user', (req,res) =>{
    res.send({name:"venkat"})
})

app.delete("/user", (req,res) =>{
    res.send("deleting the user")
})
// handle the requests for any routes
app.use("/home", (req, res)=>{
    res.send("this is the home page")
})
app.use('/',(req,res) =>{
    res.send("this is the default page")
})

// this is the request handler
app.use((req,res)=>{
    res.send("handling the requestes")
})

// accept the requests or listen to the requests 
app.listen(7777, ()=>{
    console.log("server is listening on port no 7777")
})