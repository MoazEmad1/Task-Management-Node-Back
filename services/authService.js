const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
require('dotenv').config();
const secret=process.env.JWT_SECRET


exports.registerUser=async({phoneNumber,firstName,secondName,password,email})=>{
    if(!phoneNumber||!firstName||!secondName||!password||!email){
        return new Error('All fields are required');
  }
    let user=await User.findOne({phoneNumber});
    if(user)throw new Error('Phone Number already exists');

    const passwordHash= await bcrypt.hash(password,10);
    user=new User({
        phoneNumber,
        firstName,
        secondName,
        passwordHash,
        email
  });
    await user.save();
    return{message:'User Registered Successfully'};
};

exports.loginUser=async({phoneNumber,password})=>{
    const user=await User.findOne({phoneNumber});
    if(!user)throw new Error('Invalid phone number or password');
    const validPass=await bcrypt.compare(password,user.passwordHash);
    if(!validPass)throw new Error('Invalid phone number or password');
    const token=jwt.sign({userId:user._id},secret,{expiresIn:'7d'});

    return{token,phoneNumber:user.phoneNumber};
};

