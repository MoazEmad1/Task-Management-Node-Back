const express=require('express');
const router=express.Router();
const verifyToken=require('../middleware/verifyToken');
const oldTaskController=require('../controllers/oldTaskController');

router.post('/:taskId/moveToTasks',verifyToken, oldTaskController.moveToTasks);
router.get('/',verifyToken, oldTaskController.getOldTasks);

module.exports=router;