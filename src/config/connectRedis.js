const redis = require("redis")
const { log } = require("../utils/logger")
let client;
const initDB = async function () {
    //DONE: set up connection with redis
    return new Promise(async (resolve, reject) => {
        if (client) {
            log.warn("Redis database is already connected");
            resolve(client);
        }

        client = await redis.createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
        await client.connect();

        client.on("error", function (error) {
            log.error("Redis connection error", error);
        });
        resolve(client);
    })
}

const getDB = async () => {
    //DONE: get client you just set 
    if (!client) {
        throw Error("DataBase not intialized")
    }
    return client;
}

module.exports = {
    initDB,
    getDB
}