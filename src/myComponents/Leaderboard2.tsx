// src/components/Leaderboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "./Navbar2";

interface Player {
  id: string;
  initial: string;
  name: string;
  completedLevels: number;
  points: number;
}

interface UserData {
  username: string;
  isTeenUser: boolean;
}

// Sample other players
const samplePlayers: Player[] = [
  { id: "p2", initial: "S", name: "Sneha", completedLevels: 3, points: 300 },
  { id: "p3", initial: "P", name: "Pankaj", completedLevels: 2, points: 200 },
  { id: "p4", initial: "A", name: "Aarya", completedLevels: 2, points: 225 },
  { id: "p5", initial: "P", name: "Piu", completedLevels: 2, points: 200 },
  { id: "p6", initial: "S", name: "Sophia", completedLevels: 1, points: 175 },
  { id: "p7", initial: "A", name: "Aarav", completedLevels: 1, points: 150 },
];

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. Fetch current user info
      let userName = "You";
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (res.ok) {
          const userData: UserData = await res.json();
          userName = userData.username || "You";
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }

      // 2. Read current user's stats from localStorage
      const completedLevelsList: string[] = JSON.parse(
        localStorage.getItem("completedLevels") || "[]"
      );
      const completedLevels = completedLevelsList.length;
      const points = parseInt(localStorage.getItem("totalPoints") || "0", 10);

      // 3. Build current user object
      const initial = userName.charAt(0).toUpperCase();
      const currentUser: Player = {
        id: "currentUser",
        initial,
        name: userName,
        completedLevels,
        points,
      };

      // 4. Combine and sort
      const all = [currentUser, ...samplePlayers].sort((a, b) => {
        if (b.completedLevels !== a.completedLevels) {
          return b.completedLevels - a.completedLevels;
        }
        return b.points - a.points;
      });

      setPlayers(all);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-gray-200 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading leaderboard…</p>
        </div>
      </div>
    );
  }

  // Determine current user's rank
  const idx = players.findIndex((p) => p.id === "currentUser");
  const currentRank = idx >= 0 ? idx + 1 : null;
  const current = idx >= 0 ? players[idx] : null;

  return (
    <div className="min-h-screen relative">
      {/* A blurred, semi-transparent overlay behind everything */}
      <div
        className="absolute inset-0 bg-black/40 z-0"
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Main content container with a slightly-opacity background image */}
      <div
        className="relative z-10 min-h-screen bg-cover bg-center bg-no-repeat p-6"
        style={{ backgroundImage: `url('images/image.jpg')`, opacity: 0.7 }}
      >
        <Navbar />
        <div className="bg-black/80 rounded-lg shadow-xl p-10 max-w-7xl mx-auto text-white mt-16">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-2">Leaderboard</h2>
            <p className="text-muted-foreground text-sm">
              See how you rank among other explorers
            </p>
          </div>

          {/* Your Ranking */}
          {current && (
            <Card className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-lg mb-8">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Your Ranking</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Rank Badge */}
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                      {currentRank}
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                      <span className="text-white font-semibold text-xl">
                        {current.initial}
                      </span>
                    </div>

                    <div>
                      <p className="text-2xl font-semibold text-white">
                        {current.name}
                      </p>
                      <p className="text-white/80">
                        {current.completedLevels} levels completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-300 fill-current" />
                    <span className="font-semibold text-xl text-white">
                      {current.points}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {players.slice(0, 3).map((p, i) => {
              // Choose gradient based on position
              let gradient = "from-yellow-400 to-orange-400";
              if (i === 0) gradient = "from-yellow-400 to-orange-400";
              else if (i === 1) gradient = "from-gray-400 to-gray-500";
              else if (i === 2) gradient = "from-orange-400 to-red-400";

              return (
                <Card
                  key={p.id}
                  className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-shadow duration-200`}
                >
                  <div className="p-6 flex flex-col items-center">
                    {/* Rank Circle */}
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-3xl mb-4 border-2 border-white/30">
                      {i + 1}
                    </div>

                    {/* Avatar */}
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 mb-4">
                      <span className="text-white font-semibold text-2xl">
                        {p.initial}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-1">
                      {p.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-3">
                      {p.completedLevels} levels
                    </p>

                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      <span className="font-semibold text-white">
                        {p.points} pts
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* All Explorers */}
          <Card className="bg-white/10 text-white shadow-xl">
            <div className="p-6 space-y-6">
              <h2 className="text-3xl font-bold">All Explorers</h2>
              <p className="text-white/80">
                Climb the ranks by completing levels and earning points. See where
                you stand!
              </p>
              <div className="space-y-3">
                {players.map((p, i) => {
                  const isCurrent = p.id === "currentUser";
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                        isCurrent
                          ? "bg-purple-500/30 border border-purple-400/50"
                          : "hover:bg-white/5 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 font-semibold text-white">
                          {i + 1}
                        </span>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                          <span className="text-white font-semibold text-lg">
                            {p.initial}
                          </span>
                        </div>
                        <span
                          className={`font-medium ${
                            isCurrent ? "text-purple-300" : "text-white"
                          }`}
                        >
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-white/80">
                          {p.completedLevels} levels
                        </span>
                        <div className="flex items-center gap-2 w-24 justify-center bg-white/10 px-3 py-1 rounded-full">
                          <Star className="w-5 h-5 text-yellow-300 fill-current" />
                          <span className="font-semibold text-white">
                            {p.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
