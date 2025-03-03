const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true
  },
    firstName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
  },
    secondName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
  },
    picture:String,
    userPreferences:{type:Object},
    passwordHash:{
        type:String,
        required:true
  },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
  },
    createdAt:{
        type:Date,
        default:Date.now
  },
    lastSeen:{
        type:Date,
        default:Date.now
  }
},{timestamps:true});

module.exports=mongoose.model('User',userSchema);


