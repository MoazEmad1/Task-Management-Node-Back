const Task=require('../models/Task');
const User=require('../models/User');
const OldTask=require('../models/OldTask');
const redisClient=require('../config/redis');
const logger=require("../config/logger");

exports.createTask=async(req)=>{
    const {title,dueDate,contributors}=req.body;
    if(!title||!dueDate){
        throw new Error('Title and due date are required');
   }
    const coordinatorId=req.user.userId;
    const coordinator=await User.findById(coordinatorId);
    if(!coordinator){
        throw new Error('Coordinator not found');
   }
    if(contributors&&contributors.length>0){
        const contributorsFound=await User.find({_id:{$in:contributors}});
        if(contributorsFound.length!==contributors.length){
            throw new Error('Some contributors not found');
       }
   }
    const task=new Task({title,dueDate,coordinator:coordinatorId,contributors});
    await task.save();
    await redisClient.del('tasks');
    return {message:'Task created successfully',task};
}


exports.updateTask=async (req) => {
    const {taskId}= req.params;
    const userId=req.user.userId;
    const {title,dueDate,startDate,state,contributors,attachments}= req.body;
    
    const task=await Task.findById(taskId);
    if (!task) return {message:'Task not found'};
    
    if (task.contributors.includes(userId)&&!task.coordinator.equals(userId)){
        return {message:'You are not assigned to this task'};
   }
    
   if (task.coordinator.equals(userId)){ 
        if(state)task.state=state;
        if(startDate)task.startDate=startDate;
        if(dueDate)task.dueDate=dueDate;
        if(title)task.title=title;

        if(contributors){
            const contributorsFound=await User.find({_id:{$in:contributors}});
            if(contributorsFound.length!==contributors.length){
                throw new Error('Some contributors not found');
            }
            task.contributors=contributors;
        }

    }
    
    await task.save();
    await redisClient.del('tasks'); 
    return {message:'Task updated',task};
}
exports.addComment=async(req)=>{
    const {taskId}=req.params;
    const {text,images=[],mentions=[]}=req.body;
    const userId=req.user.userId;

    if(!text)throw new Error('Comment text is required');

    const task=await Task.findById(taskId);
    if(!task)throw new Error('Task not found');

    if (!task.coordinator.equals(userId) &&!task.contributors.includes(userId)) {
        throw new Error('You are not allowed to comment on this task');
    }
    const newComment={
        user:userId,
        text,
        images,
        mentions};
    task.comments.push(newComment);
    await task.save();
    await redisClient.del(`task:${taskId}`);
    return {message:'Comment added successfully',comment:newComment};
};


exports.moveToOldTasks=async(req)=>{
    const {taskId}=req.params;
    const userId=req.user.userId;
    const task=await Task.findById(taskId);
    if(!task)throw new Error('Task not found');
    if(!task.coordinator.equals(userId))throw new Error('You are not the coordinator of this task');

    const oldTask=new OldTask({
        _id:task._id,
        title:task.title,
        dueDate:task.dueDate,
        startDate:task.startDate,
        state:'Done',
        coordinator:task.coordinator,
        contributors:task.contributors,
        attachments:task.attachments,
        location:task.location,
        comments:task.comments,
        movedAt:Date.now()
   });
    await oldTask.save();
    await Task.findByIdAndDelete(task._id);
    await redisClient.del('tasks');
    return {message:'Task moved to old tasks'};
}
exports.getTasks=async(req)=>{
    const {state,coordinator,contributor,search,dueDateFrom,dueDateTo,lastId,limit=10}=req.query;
    let filter={};
    logger.info("Fetching tasks", { state, search });


    if(state)filter.state=state;
    if(coordinator)filter.coordinator=coordinator;
    if(contributor)filter.contributors=contributor;
    if(search)filter.title={$regex:search,$options:'i'};
    if(dueDateFrom||dueDateTo){
      filter.dueDate={};
      if(dueDateFrom)filter.dueDate.$gte=new Date(dueDateFrom);
      if(dueDateTo)filter.dueDate.$lt=new Date(dueDateTo);
    }

    if(lastId)filter._id={$gt:lastId};

    const cacheKey=`tasks:${JSON.stringify(filter)}`;
    const cachedTasks=await redisClient.get(cacheKey);
    if(cachedTasks)return JSON.parse(cachedTasks);

    const tasks=await Task.find(filter)
      .sort({_id:1})
      .limit(Number(limit))
      .select('title dueDate state coordinator contributors')
      .populate('coordinator','firstName lastName')
      .populate('contributors','firstName lastName');
    await redisClient.set(cacheKey, JSON.stringify(tasks), { EX: 60 });
    return { tasks, lastId: tasks.length ? tasks[tasks.length - 1]._id : null };
}