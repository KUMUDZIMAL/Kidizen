"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Star, ListOrdered, CheckCircle } from "lucide-react";

interface User {
  username: string;
  age: number;
  _id: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [lastScore, setLastScore] = useState<number>(0); // this will hold (stored totalPoints / 100)
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  useEffect(() => {
    // Fetch the logged‐in user data
    fetch("/api/auth/user", {
      method: "GET",
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error);

    // 1. Read completedLevels from localStorage
    const done = JSON.parse(localStorage.getItem("completedLevels") || "[]");
    setCompletedLevels(done);

    // 2. Read totalPoints from localStorage, then divide by 100
    const rawPoints = parseInt(localStorage.getItem("totalPoints") || "0", 10);
    const displayPoints = rawPoints;
    setLastScore(displayPoints);

    // 3. Read questionsAnswered and correctAnswers
    const qAns = parseInt(localStorage.getItem("questionsAnswered") || "0", 10);
    setQuestionsAnswered(qAns);

    const cAns = parseInt(localStorage.getItem("correctAnswers") || "0", 10);
    setCorrectAnswers(cAns);
  }, []);

  // Show a loading state while user data hasn’t arrived
  if (!user) {
    return <p className="text-center text-white text-xl">Loading...</p>;
  }

  // Compute percent of levels completed (out of 3)
  const totalLevels = 3;
  const percentDone = (completedLevels.length / totalLevels) * 100;

  // Compute accuracy percentage
  const accuracy = questionsAnswered
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0;

  return (
    <div className="min-h-screen relative">
      {/* A blurred, semi‐transparent overlay behind everything */}
      <div
        className="absolute inset-0 bg-black/40 z-0"
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Main content container with a slightly‐opacity background image */}
      <div
        className="relative z-10 min-h-screen bg-cover bg-center bg-no-repeat p-6"
        style={{ backgroundImage: `url('images/image.jpg')`, opacity: 0.7 }}
      >
        <div className="bg-black/80 rounded-lg shadow-xl p-10 max-w-7xl mx-auto text-white">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-2">Welcome, {user.username}!</h2>
            <p className="text-muted-foreground text-sm">
              Track your learning progress below
            </p>
          </div>

          {/* Top‐row Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* 1) Overall Progress Card */}
            <Card className="bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-lg min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={percentDone} className="h-2 bg-white/30 mb-2" />
                <p>
                  {completedLevels.length} / {totalLevels} levels completed
                </p>
                <p className="text-sm text-white/80">
                  {Math.round(percentDone)}% done
                </p>
              </CardContent>
            </Card>

            {/* 2) Total Points Card (now divided by 100) */}
            <Card className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-lg min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* lastScore already = rawPoints / 100 */}
                <p className="text-4xl font-bold">{lastScore}</p>
                <p className="text-sm text-white/80">points earned</p>
              </CardContent>
            </Card>

            {/* 3) Question Stats Card */}
            <Card className="bg-gradient-to-r from-blue-400 to-sky-400 text-white shadow-lg min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListOrdered className="h-5 w-5" />
                  Question Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{questionsAnswered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correct:</span>
                  <span>
                    {correctAnswers} ({accuracy}%)
                  </span>
                </div>
                <Progress value={accuracy} className="h-2 bg-white/30" />
              </CardContent>
            </Card>

            {/* 4) Profile Card */}
            <Card className="bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg min-h-[200px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {/* Just a placeholder avatar circle with “K” */}
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                    K
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-white/100">Age: {user.age}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress List */}
          <Card className="bg-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Level Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((id) => {
                const done = completedLevels.includes(id.toString());
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          done ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {done ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-semibold">{id}</span>
                        )}
                      </div>
                      <span className={done ? "text-green-300" : "text-white"}>
                        Level {id}
                      </span>
                    </div>
                    <span>{done ? "✅ Completed" : "❌ Not completed"}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
