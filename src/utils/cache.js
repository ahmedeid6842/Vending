const mongoose = require("mongoose");
const redis = require("redis");

const { getDB } = require("../config/connectRedis");


const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = async function (option = {}) {
    /**
     * DONE: set flag to specify we will use cach for this mongoose query
     * DONE: set the hashkey
     * */
    this.useCache = option.useCache;
    this.hashKey = JSON.stringify(option.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function () {
    //DONE: get redis client
    let client = await getDB();

    // DONE: if cach flag not set apply query as it's 
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    //DONE: set the key which is collectionName and get query
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name })
    );

    /**
     * DONE: check if this query exists in redis 
     *       if it's then return it 
     *       else apply query in mongodb and store the result in redis to use in future
     * */

    let cachedValue = await client.HGET(this.hashKey, key);
    if (cachedValue) {
        cachedValue = JSON.parse(cachedValue);
        return Array.isArray(cachedValue) ?
            cachedValue.map(value => new this.model(value))
            : new this.model(cachedValue);

    }
    const result = await exec.apply(this, arguments);
    await client.HSET(this.hashKey, key, JSON.stringify(result));
    await client.expire(this.hashKey, 60);
    return result;
}

const clearHash = async function (hashKey) {
    let client = await getDB();
    client.del(JSON.stringify(hashKey));
}

module.exports = {
    clearHash
}