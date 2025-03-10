const Activity=require('../models/Activity');

exports.getUserActivities=async(userId,query)=>{
    const {lastId,limit=10} = query;
    
    let filter={user:userId};
    if (lastId) filter._id={$lt: lastId};

    const activities = await Activity.find(filter)
        .sort({_id:-1})
        .limit(Number(limit))
        .populate('task','title state');

    return {activities, lastId:activities.length ? activities[activities.length-1]._id:null};
};
