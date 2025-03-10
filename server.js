require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const helmet=require('helmet');
const compression=require('compression');
const cors=require('cors');
// const pino=require('pino');
// const pinoHttp=require('pino-http');
// const cron=require('node-cron');
const {initKafka}=require('./config/kafka');
const {consumeMessages}=require('./jobs/moveTasksJob');
const {triggerTaskMove}=require('./producer');



const authRoutes=require('./routes/authRoutes');
const taskRoutes=require('./routes/taskRoutes');
const oldTaskRoutes=require('./routes/oldTaskRoutes')
const userRoutes=require('./routes/userRoutes');
const {moveOldTasks}=require('./jobs/moveTasksJob');
const logger=require("./config/logger");


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(compression());
app.use(cors());
// app.use(pinoHttp({logger:pino({level:'info'})}));

const PORT=process.env.PORT||3000;
const MONGO_URI=process.env.MONGO_URI||'mongodb://localhost:27017/TaskManagement';

mongoose.connect(MONGO_URI)
.then(()=>console.log('Connected to mongoDB'))
.catch(err=>console.error('Connection Error to mongoDB',err));

initKafka().then(() => {
  console.log('Kafka initialized');
  consumeMessages();
}).catch(err => console.error('Kafka initialization error:', err));

setInterval(triggerTaskMove, 60 * 60 * 1000)

app.use((req,res,next)=>{
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

app.use((err,req,res,next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(500).send("Something went wrong!");
});
logger.info("Testing app.log");



app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/oldTasks',oldTaskRoutes);
app.use('/api/users',userRoutes);

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
