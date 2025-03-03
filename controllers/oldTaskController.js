const oldTaskService=require('../services/oldTaskService');

exports.moveToTasks=async (req, res) => {
    try {
        const result=await oldTaskService.moveToTasks(req);
        res.status(200).json(result);
    } catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.getOldTasks=async (req, res) => {
    try {
        const result=await oldTaskService.getOldTasks(req);
        res.status(200).json({result});
    } catch(err){
        res.status(500).json({message:err.message});
    }
}