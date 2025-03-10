const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController');
const authMiddleware=require('../middlewares/authMiddleware');

router.get('/activities',authMiddleware,userController.getUserActivities);

module.exports=router;
