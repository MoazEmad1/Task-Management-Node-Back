const Task=require('../models/Task');
const OldTask=require('../models/OldTask');
const {consumer}=require('../config/kafka');

const moveOldTasks=async()=>{
    try{
        const now=new Date();
        now.setHours(now.getHours()-24);
        const oldTasksToMove=await Task.find({state:'Done',updatedAt:{$lte:now}});

        if(oldTasksToMove.length===0){
            console.log('No tasks to move');
            return;
        }

        const bulkInsert=oldTasksToMove.map(task=>({
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
        }));
        
        await OldTask.insertMany(bulkInsert);
        await Task.deleteMany({_id:{$in:oldTasksToMove.map(task=>task._id)}});
        
        console.log(`${oldTasksToMove.length} tasks moved to old tasks`);
   }catch(err){
        console.log(err);
   }
}

exports.consumeMessages=async()=>{
    await consumer.subscribe({topic:'move-task',fromBeggining:false});

    await consumer.run({
        eachMessage:async({message})=>{
            const value=JSON.parse(message.value.toString());
            if(value.action==='moveOldTasks'){
                console.log('Processing task move event...');
                await moveOldTasks();
           }
       }
    });
}
    