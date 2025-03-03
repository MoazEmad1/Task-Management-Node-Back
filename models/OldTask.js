const mongoose=require('mongoose');

const oldTaskSchema=new mongoose.Schema({
    title:String,
    dueDate:Date,
    startDate:Date,
    state:String,
    coordinator:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
  }],
    attachments:[{type:String}],
    location:{type:String},
    comments:[{
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
          },
            text:{
                type:String,
                required:true
          },
            images:[String],
            mentions:[{type:mongoose.Schema.Types.ObjectId,ref:'Task'}],
            createdAt:{
                type:Date,
                default:Date.now
          }
      }],
    movedAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});
oldTaskSchema.index({title:'text'});
oldTaskSchema.index({dueDate:1});
oldTaskSchema.index({state:1});
oldTaskSchema.index({coordinator:1});
oldTaskSchema.index({contributors:1});

module.exports=mongoose.model('OldTask',oldTaskSchema);