//import the express module
const express = require('express');
const {connectDB} = require('./Config/dataBase');
const User = require('./models/user');
const {validateSignUp} = require('./utils/validateSignUp');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {userAuth} = require('./middlewares/auth');
//create an app from the express module
const app = express();

// express.json() line converts the response into json format
app.use(express.json());
// cookieParser()  parses the request for the following endpoints 
app.use(cookieParser())

app.post('/signup', async (req, res)=>{
    const {firstName, lastName, email, password, age, gender, photoUrl, country, skills} = req.body;
    try{
     validateSignUp(req);
     const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        age,
        gender,
        photoUrl,
        country,
        skills
    });
        await  user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        res.status(500).send("Error in signing up the user" + err.message);
    }
})

app.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error("Invalid login credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token = await jwtToken.sign({userId: user._id}, 'secretKey', {expiresIn: '1d'});
            res.cookie('token', token);
            res.status(200).send("User logged in successfully");
        }
        else{
            throw new Error("Invalid login credentials");
        }
    }
    catch(err){
        res.status(500).send("Error in logging in the user" + err.message);
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

app.get("/profile", userAuth ,async(req,res)=>{
    try{
            const user = req.user;
            res.send(user);
    }
    catch(err){
        res.status(500).send("Error in fetching profile" + err.message);
    }
})

app.get("/sendConnectionRequest",  userAuth,async(req,res) =>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("User not found");
        }
        res.send("Connection request sent successfully by " + user.firstName);
    }catch(err){
        res.status(500).send("Error in sending connection request" + err.message);
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
 app.patch("/user/:id", async (req,res)=>{
    const id = req.params.id;
    const data = req.body
    try{
        const allowedUpdates = ['firstName', 'lastName', 'password', 'age','skills', 'photoUrl'];
        const notAllowedUpdates = Object.keys(data).every((key)=> allowedUpdates.includes(key));
        if(!notAllowedUpdates){
            throw new Error("Invlalid Updates");
        }
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


