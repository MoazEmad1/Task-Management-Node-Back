const Task=require('../models/Task');
const User=require('../models/User');
const OldTask=require('../models/OldTask');



exports.moveToTasks=async(req)=>{
    const {taskId}=req.params;
    const userId=req.user.userId;
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
    await OldTask.findByIdAndDelete(task._id);
    return {message:'Old Task moved to Tasks'};
}
exports.getOldTasks=async(req)=>{
    let{page=1,limit=10,state,search}=req.query;
    page=parseInt(page);
    limit=parseInt(limit);

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
    return {totalOldTasks,page,limit,totalPages:Math.ceil(totalOldTasks/limit),oldTasks};
}