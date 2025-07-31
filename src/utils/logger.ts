import { createLogger, format, transports } from 'winston';
import { MongoDB } from 'winston-mongodb';

/**
 * DONE: add custom logger which contain timestamp and level
 * DONE: log all level at console
 * DONE: log error level at mongodb
 *  DONE:  limit log's collection size to 10 megabyte and 100 row
 */

export const log = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }: any) => {
      return `[${timestamp}] ${level} : ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new MongoDB({
      db: process.env.MONGODB_URI as string,
      collection: 'logs',
      options: { useUnifiedTopology: true },
      format: format.combine(format.timestamp(), format.json()),
      level: 'error',
    }),
  ],
});
