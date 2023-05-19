import { GetLogPath } from './FileUtils';

const winston = require('winston');

let logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    // @ts-ignore
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: GetLogPath() + '/qv-log.log',
      maxsize: 1024000,
    }),
  ],
});

export function GetLog() {
  return logger;
}
