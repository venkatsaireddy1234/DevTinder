const userMiddleware = (req,res,next)=>{
    const token = "token";
    const isAuthUser = token === "token";
    console.log("checking the authorization")
    if(!isAuthUser){
        res.status(403).send("Invalid User")
    }else{
        next()
    }
}

module.exports = {userMiddleware};