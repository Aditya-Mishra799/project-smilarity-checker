import mongoose from "mongoose";

const mongoDBURI = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

// Caching the connection for serverless architectures
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (!mongoDBURI || !dbName) {
    throw new Error("Please define MONGODB_URI and DB_NAME in .env.local");
  }

  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn
  }

  // If no promise exists, create a new one
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoDBURI,{
      dbName : dbName,
    });
  }

  try {
    cached.conn = await cached.promise; 
    return cached.conn
  } catch (error) {
    cached.promise = null; // Reset cached promise on failure
    console.error(error)
    throw error;
  }
}

export default connectToDB;
