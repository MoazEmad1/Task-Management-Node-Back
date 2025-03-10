const winston=require('winston');
const logFormat=winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({filename:'./logs/app.log'}),
    new winston.transports.Console()
  ],
});
if(process.env.NODE_ENV!=="production"){
    logger.add(new winston.transports.Console({format:winston.format.simple()}));
}
module.exports=logger;
