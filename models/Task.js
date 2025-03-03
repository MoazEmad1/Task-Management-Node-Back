const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
  },
    dueDate:{
        type:Date,
        required:true
  },
    startDate:{
        type:Date,
        default:Date.now
  },
    state:{
        type:String,
        enum:["To do","In progress","Done","In review","Approved","Not sure"],
        default:"To do"
  },
    coordinator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
  },
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
  }],
    attachments:[{type:String}],
    location:{type:String},
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
      },
        text:{
            type:String,
            required:true
      },
        images:[String],
        mentions:[{type:mongoose.Schema.Types.ObjectId,ref:"Task"}],
        createdAt:{
            type:Date,
            default:Date.now
      }
  }]
},{timestamps:true});
taskSchema.index({title:"text"});
taskSchema.index({dueDate:1});
taskSchema.index({state:1});
taskSchema.index({coordinator:1});


module.exports=mongoose.model("Task",taskSchema);