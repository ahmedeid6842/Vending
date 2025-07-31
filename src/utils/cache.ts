import mongoose, { Document, Query } from 'mongoose';
import { RedisClientType } from 'redis';
import { getDB } from '../config/connectRedis';

// Store the original exec
const exec = mongoose.Query.prototype.exec;

// Extend the Query prototype with `cache` method
interface CacheOption {
  useCache?: boolean;
  key?: string | object;
}

interface QueryWithCache<T> extends Query<T, Document<T>> {
  useCache?: boolean;
  hashKey?: string;
  cache(option?: CacheOption): this;
}

// Add `cache` method to Mongoose Query
mongoose.Query.prototype.cache = function (option: CacheOption = {}) {
  this.useCache = option.useCache ?? true;
  this.hashKey = JSON.stringify(option.key || '');
  return this;
};

// Override `exec` method
mongoose.Query.prototype.exec = async function (
  ...args: Parameters<typeof exec>
) {
  const query = this as QueryWithCache<any>;
  const client: RedisClientType = await getDB();

  if (!query.useCache) {
    return await exec.apply(query, args);
  }

  const key = JSON.stringify({
    ...query.getQuery(),
    collection: (query as any).mongooseCollection.name,
  });

  const cachedValue = await client.HGET(query.hashKey!, key);
  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    return Array.isArray(doc)
      ? doc.map(d => new query.model(d))
      : new query.model(doc);
  }

  const result = await exec.apply(query, args);
  await client.HSET(query.hashKey!, key, JSON.stringify(result));
  await client.expire(query.hashKey!, 60);
  return result;
};

// Utility function to clear Redis cache
export const clearHash = async (hashKey: string | object) => {
  const client: RedisClientType = await getDB();
  await client.del(JSON.stringify(hashKey));
};
