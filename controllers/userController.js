const userService=require('../services/userService');
const logger=require('../config/logger');

exports.getUserActivities=async(req,res)=>{
    try {
        const userId=req.user.userId;
        const data=await userService.getUserActivities(userId,req.query);
        logger.info(`User activities fetched: ${userId}`);
        res.status(200).json(data);
    }catch (error){
        logger.error("Error fetching user activities", {error:error.message});
        res.status(500).json({error: error.message});
    }
};

exports.getTaskActivities=async(req,res)=>{
    try{
        const userId=req.user.userId;
        const {taskId}=req.params;
        const data=await userService.getTaskActivities(userId,taskId,req.query);
        logger.info(`Task activities fetched: ${taskId}`);
        res.status(200).json(data);
    }catch(error){
        logger.error("Error fetching task activities", {error:error.message});
        res.status(500).json({error: error.message});
    }
}