import { Tedis } from "redis-typescript";

//TODO: set the values in env
//TODO: production env control
const redisClient = new Tedis({
	port: 6379,
	host: "127.0.0.1"
});

export default redisClient;
