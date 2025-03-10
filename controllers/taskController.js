const taskService=require('../services/taskService');
const logger=require('../config/logger');

exports.createTask=async(req,res) => {
    try {
        const result=await taskService.createTask(req);
        logger.info(`Task created: ${task._id}`,{task});
        res.status(201).json({result});
   }catch (err) {
        logger.error("Error creating task", {error:err.message});
        res.status(500).json({message:err.message});
   }
}


exports.updateTask=async(req,res)=>{
    try{
        const result=await taskService.updateTask(req);
        logger.info(`Task updated: ${task._id}`,{task});
        res.status(200).json(result);
   }catch(err){
        logger.error("Error updating task", {error:err.message});
        res.status(500).json({message:err.message});
   }
}
exports.addComment=async(req,res)=>{
    try{
        const result=await taskService.addComment(req);
        logger.info(`Comment added to task: ${task._id}`,{task});
        res.status(201).json(result);
   }catch(err){
        logger.error("Error adding comment", {error:err.message});
        res.status(500).json({message:err.message});
   }
}

exports.moveToOldTasks=async(req,res)=>{
    try{
        const result=await taskService.moveToOldTasks(req);
        logger.info(`Task moved to old tasks: ${task._id}`,{task});
        res.status(200).json(result);
   }catch(err){
        logger.error("Error moving task to old tasks", {error:err.message});
        res.status(500).json({message:err.message});
   }
}


exports.getTasks=async(req,res)=>{
    try{
          const result=await taskService.getTasks(req);
          res.status(200).json({result});
   }catch(err){
          logger.error("Error fetching tasks", {error:error.message});
          res.status(500).json({message:err.message});
   }
}