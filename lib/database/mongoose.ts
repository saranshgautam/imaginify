import mongoose from "mongoose";
import { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null ;
}

// database to be connected on each and every request or server action
// because nextJs runs on serverless environment
// serverless functions are stateless

// we will cache our connection to avoid too many mongodb connection open

// implementing caching

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise = 
        cached.promise || 
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
        })

    cached.conn = await cached.promise;

    return cached.conn
}