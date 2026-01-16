//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');
const User = require('./models/user');
//create an app from the express module
const app = express();


app.use(express.json());

app.post('/signup', async (req, res)=>{
    const userObj = req.body;
    console.log(userObj);
    const user = new User(userObj);
    try{
        await  user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        res.status(500).send("Error in signing up the user");
    }
})
connectDB().then(()=>{
    console.log("DB connected successfully");
    app.listen(7777, ()=>{
        console.log("server is listening on port no 7777")
    })
}).catch((err)=>{
    console.log("DB connection failed", err);
})


