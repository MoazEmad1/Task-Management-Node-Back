const winston = require("winston");
const { LogstashTransport } = require("winston-logstash-transport");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new LogstashTransport({
      host:process.env.LOGSTASH_HOST||"logstash",
      port:process.env.LOGSTASH_PORT||5044,
    }),
  ],
});

module.exports=logger;
