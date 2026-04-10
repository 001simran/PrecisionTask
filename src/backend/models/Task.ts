import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

export default Task;
