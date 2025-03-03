const Task=require('../models/Task');
const OldTask=require('../models/OldTask');

exports.moveOldTasks=async()=>{
    try{
        const now=new Date();
        now.setHours(now.getHours()-24);
        const oldTasksToMove=await Task.find({state:'Done',updatedAt:{$lte:now}});
        for(const task of oldTasksToMove){
            const oldTask=new OldTask({
                taskId:task._id,
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
       }
        console.log(`${oldTasksToMove.length} tasks moved to old tasks`);
   }catch(err){
        console.log(err);
   }
}
    