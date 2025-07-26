// models/GameProgress.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import User from './User';

// Define interface for Level Progress
interface ILevelProgress {
  levelId: number;
  completed: boolean;
  attempts: number;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  completedAt?: Date;
}

// Define interface for Game Progress Document
export interface IGameProgress extends Document {
  userId: mongoose.Types.ObjectId;
  totalLevelsCompleted: number;
  totalPoints: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  levels: ILevelProgress[];
  createdAt: Date;
  updatedAt: Date;
}

// Define Level Progress Subdocument Schema
const LevelProgressSchema: Schema = new Schema({
  levelId: { type: Number, required: true },
  completed: { type: Boolean, required: true, default: false },
  attempts: { type: Number, required: true, default: 0 },
  score: { type: Number, required: true, default: 0 },
  correctAnswers: { type: Number, required: true, default: 0 },
  incorrectAnswers: { type: Number, required: true, default: 0 },
  completedAt: { type: Date }
});

// Main Game Progress Schema
const GameProgressSchema: Schema<IGameProgress> = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    totalLevelsCompleted: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    levels: [LevelProgressSchema]
  },
  { timestamps: true }
);

// Create compound index for faster queries
GameProgressSchema.index({ userId: 1, 'levels.levelId': 1 });

const GameProgress: Model<IGameProgress> = 
  mongoose.models.GameProgress || 
  mongoose.model<IGameProgress>('GameProgress', GameProgressSchema);

export default GameProgress;