const userMiddleware = (req,res,next)=>{
    const token = "token";
    const isAuthUser = token === "token";
    console.log("checking the authorization")
    if(isAuthUser){
        next()
    }else{
        res.status(403).send("Unauthorised User")
    }
}

module.exports = {userMiddleware};