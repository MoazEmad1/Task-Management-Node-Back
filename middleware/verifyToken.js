const jwt=require('jsonwebtoken');
require('dotenv').config();
const secret=process.env.JWT_SECRET;

const verifyToken=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token)return res.status(401).json({message:'Access Denied'});
    try{
        const decoded=jwt.verify(token,secret);
        req.user=decoded;
        console.log(req.user);
        next();

  }catch(err){
        res.status(401).json({message:'Invalid Token'});
  }
}

module.exports=verifyToken;

