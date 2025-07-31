import { createClient, RedisClientType } from 'redis';
import { log } from '../utils/logger';

let client: RedisClientType | null = null;
export const initDB = async function () {
  //DONE: set up connection with redis
  return new Promise(resolve => {
    if (client) {
      log.warn('Redis database is already connected');
      resolve(client);
    }

    client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    client.connect();

    client.on('error', function (error) {
      log.error('Redis connection error', error);
    });
    resolve(client);
  });
};

export const getDB = async () => {
  //DONE: get client you just set
  if (!client) {
    throw Error('DataBase not intialized');
  }
  return client;
};
