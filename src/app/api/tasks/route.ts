import { connectDB, jsonDb } from '@/backend/lib/db';
import Task from '@/backend/models/Task';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    
    if (db.type === 'mongodb') {
      const tasks = await Task.find({}).sort({ createdAt: -1 });
      return NextResponse.json(tasks);
    } else {
      const tasks = jsonDb.read();
      return NextResponse.json(tasks.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await connectDB();
    
    if (db.type === 'mongodb') {
      const task = await Task.create({ title: body.title.trim(), completed: false });
      return NextResponse.json(task, { status: 201 });
    } else {
      const tasks = jsonDb.read();
      const newTask = {
        _id: crypto.randomUUID(),
        title: body.title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      jsonDb.write(tasks);
      return NextResponse.json(newTask, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
