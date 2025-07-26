import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const UserRanking = () => {
  return (
    <Card className="p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Your Ranking</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
            10
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">P</span>
          </div>
          <div>
            <div className="font-semibold">Prachi Raut</div>
            <div className="text-gray-500 text-sm">0 levels completed</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold">0</span>
        </div>
      </div>
    </Card>
  );
};

export default UserRanking;