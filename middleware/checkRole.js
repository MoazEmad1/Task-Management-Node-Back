const checkRole=(role) => (req,res,next) => {
    if (req.user.role!==role) return res.status(403).json({message:`Access is for ${role}only`});
    next();
};
module.exports=checkRole;
