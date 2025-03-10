const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController');
const verifyToken=require('../middleware/verifyToken');

router.get('/activities',verifyToken,userController.getUserActivities);
router.get('/:taskId/taskActivities',verifyToken,userController.getTaskActivities);

module.exports=router;
