const userService=require('../services/userService');

exports.getUserActivities=async(req,res)=>{
    try {
        const userId=req.user.userId;
        const data=await userService.getUserActivities(userId,req.query);
        res.status(200).json(data);
    }catch (error){
        res.status(500).json({ error: error.message });
    }
};
