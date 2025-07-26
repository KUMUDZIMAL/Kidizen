"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  rightInfo: string;
};

export type Level = {
  id: number;
  name: string;
  description: string;
  position: { x: number; y: number };
  questions: Question[];
  isLocked: boolean;
  completed: boolean;
  pointsToEarn: number;
};

type GameContextType = {
  levels: Level[];
  setLevels: React.Dispatch<React.SetStateAction<Level[]>>;
  currentLevel: Level | null;
  setCurrentLevel: (level: Level | null) => void;
  unlockLevel: (levelId: number) => void;
  markLevelCompleted: (levelId: number) => void;
};

// Initialize the context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [levels, setLevels] = useState<Level[]>([]); // Initialize with an empty array or your default levels
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);

  const unlockLevel = (levelId: number) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId ? { ...level, isLocked: false } : level
      )
    );
  };

  const markLevelCompleted = (levelId: number) => {
    setLevels(prevLevels => {
      const updatedLevels = prevLevels.map(level =>
        level.id === levelId ? { ...level, completed: true } : level
      );

      // Unlock the next level if there is one
      const completedLevelIndex = prevLevels.findIndex(level => level.id === levelId);
      if (completedLevelIndex !== -1 && completedLevelIndex < prevLevels.length - 1) {
        updatedLevels[completedLevelIndex + 1].isLocked = false;
      }

      return updatedLevels;
    });
  };

  return (
    <GameContext.Provider value={{ levels, setLevels, currentLevel, setCurrentLevel, unlockLevel, markLevelCompleted }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
