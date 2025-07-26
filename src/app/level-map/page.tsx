"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LevelInfo {
  id: number;
  title: string;
  completed: boolean;
  isLocked: boolean;
}

const LevelMapPage = () => {
  const router = useRouter();
  const [levels, setLevels] = useState<LevelInfo[]>([]);

  useEffect(() => {
    const storedCompleted = JSON.parse(localStorage.getItem("completedLevels") || "[]");

    const updatedLevels: LevelInfo[] = [
   
            { id: 1, title: "Right to privacy", completed: false,  isLocked: true },
            { id: 2, title: "Cyber Bullying", completed: false,  isLocked: true },
            { id: 3, title: "Right to Participation", completed: false,  isLocked: true },
            { id: 4, title: "Consent & Boundaries", completed: false,  isLocked: true },
            { id: 3, title: "Mental Health Matters", completed: false,  isLocked: true },
            { id: 3, title: "Health & Reproductive Rights", completed: false,  isLocked: true },
        
          
    ].map((level, index, arr) => {
      const isCompleted = storedCompleted.includes(level.id.toString());

      // Unlock logic
      let isLocked = true;
      if (level.id === 1) {
        isLocked = false; // first level always unlocked
      } else {
        const prevLevelId = level.id - 1;
        const prevLevelCompleted = storedCompleted.includes(prevLevelId.toString());
        isLocked = !prevLevelCompleted;
      }

      return {
        ...level,
        completed: isCompleted,
        isLocked: isLocked,
      };
    });

    setLevels(updatedLevels);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-5xl font-extrabold text-center mb-14 text-white">Level Map</h1>
      <div className="space-y-10">
        {levels.map((level, idx) => (
          <div
            key={level.id}
            className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-10 border border-gray-300"
          >
            <div className="flex items-center gap-8">
              <span className="text-4xl font-bold w-12 text-center text-black">{idx + 1}.</span>
              <span className="text-2xl font-semibold text-black">{level.title}</span>
              {level.isLocked ? (
                <Lock className="text-red-400 ml-4 w-8 h-8" />
              ) : (
                <Unlock className="text-green-500 ml-4 w-8 h-8" />
              )}
            </div>
            {!level.isLocked && (
              <Button
                className="ml-8 px-10 py-4 text-2xl bg-green-300 hover:bg-green-400 text-black font-normal"
                onClick={() => router.push(`/level/${level.id}`)}
              >
                Play
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelMapPage;
