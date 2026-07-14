import { Emitter } from "@socket.io/redis-emitter";
import { redisClient } from "../config/redis.config.js";


export const socketEmitter = new Emitter(redisClient);