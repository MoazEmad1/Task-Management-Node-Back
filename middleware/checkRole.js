const checkRole=(userId,task) => (req,res,next) => {
    if (!task.coordinator.equals(userId)) return res.status(403).json({message:`Access is for coordinators only`});
    next();
};
module.exports=checkRole;
