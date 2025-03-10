const {producer}=require('./config/kafka');

exports.triggerTaskMove=async()=>{
    try{
        await producer.send({
            topic:'move-task',
            messages:[{value:JSON.stringify({action:'moveOldTasks'})}],
        });
        console.log('Task move triggered');s
    }catch(err){
        console.error(err);
    }
}
