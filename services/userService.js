const Activity=require('../models/Activity');
const Task=require('../models/Task');

exports.getUserActivities=async(userId,query)=>{
    const {lastId,limit=10}=query;
    
    let filter={user:userId};
    if (lastId) filter._id={$lt: lastId};

    const activities=await Activity.find(filter)
        .sort({_id:-1})
        .limit(Number(limit))
        .populate('task','title state');

    return {activities, lastId:activities.length ? activities[activities.length-1]._id:null};
};

exports.getTaskActivities=async(userId,taskId,query)=>{
    const {lastId,limit=10}=query;

    const task=await Task
        .findById(taskId)
        .select('coordinator');
    if(!task)throw new Error('Task not found');
    if(!task.coordinator.equals(userId))throw new Error('You are not the coordinator of this task');

    let filter={task:taskId};
    if (lastId) filter._id={$lt: lastId};

    const activities=await Activity.find(filter)
        .sort({_id:-1})
        .limit(Number(limit))
        .populate('user','firstName secondName email');
    
    return {activities, lastId:activities.length ? activities[activities.length-1]._id:null};
}