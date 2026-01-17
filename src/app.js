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
        res.status(500).send("Error in signing up the user" + err.message);
    }
})


app.get('/userByID', async(req,res)=>{
    const id = req.body.id;
    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.json(user);
        }
    }
    catch(err){
        res.status(500).send("Error in fetching the user" + err.message);
    }
})

app.get('/user', async (req, res)=>{
    const emailId = req.body.email;
    console.log(emailId)
    try{
        const user = await User.findOne({email: emailId});
        console.log(user);
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.json(user);
        }
    }
    catch(err){
        res.status(500).send("Error in fetching the user" + err.message);
    }
})


app.get('/feed', async (req,res)=>{
    try{
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send("No users found");
        }else{

            res.json(users);
        }
    }
    catch(err){
        res.status(500).send("Error in fetching users" + err.message);
    }
})
 app.delete("/user", async(req,res)=>{
    const id = req.body.id;
    console.log(id);
    try{
        const deletedUser = await User.findByIdAndDelete(id);
        console.log(deletedUser);
        if(!deletedUser){
            res.status(404).send("User not found");
        }else{
            res.json(deletedUser);
        }
    }
    catch(err){
        res.status(500).send("Error in deleting the user" + err.message);
    }
 })
 app.patch("/user", async (req,res)=>{
    const id = req.body.id;
    const data = req.body
    try{
        const user  = await User.findByIdAndUpdate(id, data, {runValidators: true});
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.json(user);
        }
    }
    catch(err){
        res.status(500).send("Error in updating the user" + err.message);
    }
 })

 app.delete('/user/:id', async (req,res)=>{
    const id = req.params.id;
    try{
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            res.status(404).send("User not found");
        }else{
            res.json(deletedUser);
        }
    }
    catch(err){
        res.status(500).send("Error in deleting the user" + err.message);
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


