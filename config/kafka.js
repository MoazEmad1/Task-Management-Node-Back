const {Kafka}=require('kafkajs');

const kafka=new Kafka({
    clientId:'task-management',
    brokers:['127.0.0.1:9092'],
});

const producer=kafka.producer();
const consumer=kafka.consumer({groupId:'task-group'});

const initKafka=async()=>{
    await producer.connect();
    await consumer.connect();
};

module.exports={Kafka,producer,consumer,initKafka};