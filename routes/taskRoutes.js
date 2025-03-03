const express=require('express');
const router=express.Router();
const taskController=require('../controllers/taskController');
const verifyToken=require('../middleware/verifyToken');

router.post('/create',verifyToken,taskController.createTask);
router.put('/update',verifyToken,taskController.updateTask);
router.post('/:taskId/addComment',verifyToken,taskController.addComment);
router.post('/:taskId/moveToOldTasks',verifyToken,taskController.moveToOldTasks);
router.get('/',verifyToken,taskController.getTasks);

module.exports=router;