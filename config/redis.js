const {createClient}=require('redis');

const redisClient=createClient({
    socket:{
        host:'redis',
        port:6379
    }
});

redisClient.on('error',(err) => {
    console.error('Redis error:', err);
});

(async()=>{
    await redisClient.connect();
    console.log('Connected to Redis');
})();

module.exports=redisClient;
