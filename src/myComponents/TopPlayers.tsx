import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Player {
  rank: number;
  initial: string;
  name: string;
  levels: number;
  points: number;
  badge: string;
  color: string;
}

const players: Player[] = [
  {
    rank: 1,
    initial: "P",
    name: "Priya",
    levels: 3,
    points: 350,
    badge: "Champion",
    color: "bg-orange-400",
  },
  {
    rank: 2,
    initial: "S",
    name: "Sneha",
    levels: 3,
    points: 300,
    badge: "Silver",
    color: "bg-blue-400",
  },
  {
    rank: 3,
    initial: "P",
    name: "Pankaj",
    levels: 2,
    points: 200,
    badge: "Bronze",
    color: "bg-green-400",
  },
];

const TopPlayers = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {players.map((player) => (
        <Card
          key={player.rank}
          className="p-6 flex flex-col items-center border border-gray-200 relative overflow-hidden"
        >
          <div
            className={`${player.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-4`}
          >
            {player.rank}
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <span className="text-gray-600 font-semibold text-xl">
              {player.initial}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{player.name}</h3>
          <p className="text-gray-500 text-sm mb-3">
            {player.levels} levels completed
          </p>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{player.points} points</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              player.color
            } text-white`}
          >
            {player.badge}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default TopPlayers;