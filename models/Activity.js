const mongoose=require('mongoose');

const activitySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
   },
    task:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task',
        required:true
   },
    action:{
        type:String,
        enum:['Created','Updated','Commented','Moved to Old','Moved to Tasks'],
        required:true
   },
    timestamp:{
        type:Date,
        default:Date.now
   }
},{timestamps:true});

activitySchema.index({user:1,timestamp:-1});

module.exports=mongoose.model('Activity',activitySchema);
