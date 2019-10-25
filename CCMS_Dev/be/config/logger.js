const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

var dt=new Date();
var y = dt.getFullYear()
var m = dt.getMonth() + 1

const levels = { 
    error: 0,
    warn: 1,
    query: 2,
    method: 3,
    notice: 4,
    info: 5,
    debug: 6,
  };
  
winston.config.npm.levels=levels

const logger = winston.createLogger({

    level: 'debug', // 최소 레벨
    // 파일저장
    transports: [
        new winston.transports.DailyRotateFile({
            filename: './log/'+y+'/'+m+'/'+'log', // log 폴더에 system.log 이름으로 저장
            zippedArchive: false, // 압축여부
            format: winston.format.printf(
                info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
        }),
        // 콘솔 출력
        new winston.transports.Console({
            format: winston.format.printf(
                info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
        })
    ]
});

module.exports = logger;
