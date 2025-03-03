const Task=require("../models/Task");
const User=require("../models/User");
const OldTask=require("../models/OldTask");

exports.createTask=async(req)=>{
    const {title,dueDate,contributors}=req.body;
    if(!title||!dueDate){
        throw new Error("Title and due date are required");
   }
    const coordinatorId=req.user.userId;
    const coordinator=await User.findById(coordinatorId);
    if(!coordinator){
        throw new Error("Coordinator not found");
   }
    if(contributors&&contributors.length>0){
        const contributorsFound=await User.find({_id:{$in:contributors}});
        if(contributorsFound.length!==contributors.length){
            throw new Error("Some contributors not found");
       }
   }
    const task=new Task({title,dueDate,coordinator:coordinatorId,contributors});
    await task.save();
    return {message:'Task created successfully',task};
}


exports.updateTask=async (req) => {
    const {taskId}= req.params;
    const userId=req.user.userId;
    const {title,dueDate,state}= req.body;
    
    const task=await Task.findById(taskId);
    if (!task) return {message:"Task not found"};
    
    if (req.user.role==="contributor"&&!task.contributors.includes(userId)) {
        return {message:"You are not assigned to this task"};
   }
    
    if (title) task.title=title;
    if (dueDate) task.dueDate=dueDate;
    if (state&&task.coordinator.equals(userId)) task.state=state;
    
    await task.save();
    return {message:"Task updated",task};
}

exports.moveToOldTasks=async(req)=>{
    const {taskId}=req.params;
    const userId=req.user.userId;
    const task=await Task.findById(taskId);
    if(!task)throw new Error("Task not found");
    if(!task.coordinator.equals(userId))throw new Error("You are not the coordinator of this task");

    const oldTask=new OldTask({
        _id:task._id,
        title:task.title,
        dueDate:task.dueDate,
        startDate:task.startDate,
        state:"Done",
        coordinator:task.coordinator,
        contributors:task.contributors,
        attachments:task.attachments,
        location:task.location,
        comments:task.comments,
        movedAt:Date.now()
   });
    await oldTask.save();
    await Task.findByIdAndDelete(task._id);
    return {message:"Task moved to old tasks"};
}
exports.getTasks=async(req)=>{
    let{page=1,limit=10,state,search}=req.query;
    page=parseInt(page);
    limit=parseInt(limit);

    const filter={};
    if(state)filter.state=state;
    if (search) {
        filter.$or=[
            {title:{$regex:search,$options:"i"}},
            {"coordinator.firstName":{$regex:search,$options:"i"}},
            {"coordinator.lastName":{$regex:search,$options:"i"}},
            {"contributors.firstName":{$regex:search,$options:"i"}},
            {"contributors.lastName":{$regex:search,$options:"i"}}
        ];
   }

    const tasks=await Task.find(filter)
        .select("title dueDate state coordinator contributors")
        .sort({dueDate:1})
        .skip((page-1)*limit)
        .limit(limit)
        .populate("coordinator","firstName lastName")
        .populate("contributors","firstName lastName");
    const totalTasks=await Task.countDocuments(filter);
    return {totalTasks,page,limit,totalPages:Math.ceil(totalTasks/limit),tasks};
}