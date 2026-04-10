import { connectDB, jsonDb } from '@/backend/lib/db';
import Task from '@/backend/models/Task';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectDB();

    const updateData: any = {};
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.title !== undefined) updateData.title = body.title.trim();

    if (db.type === 'mongodb') {
      if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
      if (!task) return NextResponse.json({ error: 'NotFound' }, { status: 404 });
      return NextResponse.json(task);
    } else {
      let tasks = jsonDb.read();
      const index = tasks.findIndex((t: any) => t._id === id);
      if (index === -1) return NextResponse.json({ error: 'NotFound' }, { status: 404 });
      
      tasks[index] = { ...tasks[index], ...updateData, updatedAt: new Date().toISOString() };
      jsonDb.write(tasks);
      return NextResponse.json(tasks[index]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (db.type === 'mongodb') {
      if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      const task = await Task.findByIdAndDelete(id);
      if (!task) return NextResponse.json({ error: 'NotFound' }, { status: 404 });
      return NextResponse.json({ success: true });
    } else {
      let tasks = jsonDb.read();
      const filtered = tasks.filter((t: any) => t._id !== id);
      if (filtered.length === tasks.length) return NextResponse.json({ error: 'NotFound' }, { status: 404 });
      jsonDb.write(filtered);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
