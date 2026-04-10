import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/precision-task';
const JSON_DB_PATH = path.join(process.cwd(), 'data', 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export async function connectDB() {
  try {
    // Attempt MongoDB connection with a short timeout
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 2000 
    });
    console.log('✅ Connected to MongoDB');
    return { type: 'mongodb' };
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Falling back to Local File Storage.');
    
    // Ensure JSON file exists
    if (!fs.existsSync(JSON_DB_PATH)) {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify([]));
    }
    return { type: 'json', path: JSON_DB_PATH };
  }
}

// Helper to handle JSON storage
export const jsonDb = {
  read: () => {
    try {
      const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  },
  write: (data: any) => {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  }
};
