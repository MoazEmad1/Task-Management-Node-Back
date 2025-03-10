const Task=require('../models/Task');
const User=require('../models/User');
const OldTask=require('../models/OldTask');
const Activity=require('../models/Activity');
const redisClient=require('../config/redis');
const logger=require("../config/logger");



exports.moveToTasks=async(req)=>{
    const {taskId}=req.params;
    const userId=req.user.userId;
    logger.info("Moving old task to tasks", { taskId, userId });
    const oldTask=await OldTask.findById(taskId);
    if(!oldTask)throw new Error('Task not found');
    if(!oldTask.coordinator.equals(userId))throw new Error('You are not the coordinator of this old task');

    const task=new Task({
        _id:oldTask._id,
        title:oldTask.title,
        dueDate:oldTask.dueDate,
        startDate:oldTask.startDate,
        state:'To do',
        coordinator:oldTask.coordinator,
        contributors:oldTask.contributors,
        attachments:oldTask.attachments,
        location:oldTask.location,
        comments:oldTask.comments,
   });
    await task.save();
    await Activity.create({
        user: userId,
        task: task._id,
        action: 'Moved to Tasks',
        details: `Old Task "${oldTask.title}" moved to Tasks`
    });
    
    await OldTask.findByIdAndDelete(task._id);

    await redisClient.del('oldTasks');
    logger.info("Old Task moved to Tasks", { taskId, userId });

    return {message:'Old Task moved to Tasks'};
}
exports.getOldTasks=async(req)=>{
    let{page=1,limit=10,state,search}=req.query;
    page=parseInt(page);
    limit=parseInt(limit);
    logger.info("Fetching old tasks", { state, search });

    const filter={};
    if(state)filter.state=state;
    if (search) {
        filter.$or=[
            {title:{$regex:search,$options:'i'}},
            {'coordinator.firstName':{$regex:search,$options:'i'}},
            {'coordinator.lastName':{$regex:search,$options:'i'}},
            {'contributors.firstName':{$regex:search,$options:'i'}},
            {'contributors.lastName':{$regex:search,$options:'i'}}
        ];
   }

    const oldTasks=await OldTask.find(filter)
        .select('title dueDate state coordinator contributors')
        .sort({dueDate:1})
        .skip((page-1)*limit)
        .limit(limit)
        .populate('coordinator','firstName lastName')
        .populate('contributors','firstName lastName');
    const totalOldTasks=await OldTask.countDocuments(filter);

    redisClient.set(`oldTasks:${JSON.stringify({page,limit,filter})}`,JSON.stringify({totalOldTasks,oldTasks}),'EX',60);
    logger.info("Old tasks fetched", { state, search });

    return {totalOldTasks,page,limit,totalPages:Math.ceil(totalOldTasks/limit),oldTasks};
}