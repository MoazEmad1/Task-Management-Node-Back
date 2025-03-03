const taskService=require('../services/taskService');


exports.createTask=async(req,res) => {
    try {
        const result=await taskService.createTask(req);
        res.status(201).json({result});
   }catch (err) {
        res.status(500).json({message:err.message});
   }
}


exports.updateTask=async(req,res)=>{
    try{
        const result=await taskService.updateTask(req);
        res.status(200).json(result);
   }catch(err){
        res.status(500).json({message:err.message});
   }
}

exports.moveToOldTasks=async(req,res)=>{
    try{
        const result=await taskService.moveToOldTasks(req);
        res.status(200).json(result);
   }catch(err){
        res.status(500).json({message:err.message});
   }
}

exports.getTasks=async(req,res)=>{
    try{
        const result=await taskService.getTasks(req);
        res.status(200).json({result});
   }catch(err){
        res.status(500).json({message:err.message});
   }
}