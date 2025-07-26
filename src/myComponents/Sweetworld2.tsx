// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { Gift, Trophy, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import LogoutButton from "./Logout";

// interface LevelInfo {
//   id: number;
//   title: string;
//   completed: boolean;
// }

// export default function SweetWorldGame() {
//   const router = useRouter();
//   const [coins] = useState(120);
//   const [levels, setLevels] = useState<LevelInfo[]>([
//     { id: 1, title: "Bullying", completed: false },
//     { id: 2, title: "Right to Education", completed: false },
//     { id: 3, title: "Child Labour", completed: false },
//   ]);
//   const [currentLevel, setCurrentLevel] = useState(1);

//   // Load progress from localStorage
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const completedLevels = JSON.parse(
//       localStorage.getItem("completedLevels") || "[]"
//     ) as string[];

//     // Update levels completion status
//     const updatedLevels = levels.map(level => ({
//       ...level,
//       completed: completedLevels.includes(level.id.toString())
//     }));

//     // Determine current level (first uncompleted level)
//     const completedCount = completedLevels.length;
//     const nextLevel = Math.min(completedCount + 1, levels.length);
    
//     setLevels(updatedLevels);
//     setCurrentLevel(nextLevel);
//   }, [levels.length]);

//   const levelData = levels.find(l => l.id === currentLevel);

//   // Leaderboard with completion status
//   const leaderboard = levels
//     .map(l => ({ title: l.title, status: l.completed ? "✅" : "❌" }))
//     .sort((a, b) => (a.status === b.status ? 0 : a.status === "✅" ? -1 : 1));

//   const playVideo = () => router.push(`/video2/${currentLevel}`);
//   const takeQuiz = () => router.push(`/level2/${currentLevel}`);

//   if (!levelData) return <div>Loading levels...</div>;

//   return (
//     <div className="w-full h-screen overflow-hidden">
//       <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-yellow-200 p-4 flex flex-col">
//         {/* Top bar */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-2 bg-yellow-100 rounded-full px-6 py-3 shadow-md">
//             <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
//               <span className="text-yellow-800 text-xl">$</span>
//             </div>
//             <span className="font-bold text-yellow-800 text-2xl">{coins}</span>
//           </div>
//           <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center shadow-md">
//             <Gift className="h-8 w-8 text-white" />
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="flex-1 flex flex-col items-center justify-center mb-15">
//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400 drop-shadow-lg">
//             JUSTICE PLAY
//           </h1>
//           <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-pink-600">
//             Level {currentLevel}: {levelData.title}
//           </h2>

//           <div className="mt-8 flex gap-6">
//             <Button
//               onClick={playVideo}
//               className="w-48 h-16 bg-purple-500 hover:bg-purple-600 rounded-full text-white font-bold text-xl shadow-lg border-2 border-white/50"
//             >
//               Play Video
//             </Button>
     
         
//           </div>

//           {levels.every(l => l.completed) ? (
//             <p className="mt-4 text-green-600 font-bold text-xl">
//               🎉 All levels completed!
//             </p>
//           ) : (
//             <p className="mt-4 text-blue-600 font-semibold">
//               {levels.filter(l => l.completed).length}/{levels.length} levels completed
//             </p>
//           )}
//         </div>

//         {/* Leaderboard */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//           <h3 className="font-bold mb-2">Progress</h3>
//           <ul className="list-disc list-inside">
//             {leaderboard.map((item, idx) => (
//               <li key={idx}>
//                 {item.title} — {item.status}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-between items-center">
//           <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
//             <Trophy className="h-6 w-6 text-yellow-800" />
//           </div>
//           <div className="flex gap-4 text-blue-500 text-base font-medium">
//             <div className="flex items-center gap-1">
//               <ThumbsUp /> <span>51.9K</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <ThumbsDown /> <span>15.1K</span>
//             </div>
//             <Flag className="text-blue-500" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Gift, Trophy, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LogoutButton from "./Logout";
import Navbar from "./Navbar2";

interface LevelInfo {
  id: number;
  title: string;
  completed: boolean;
}

export default function SweetWorldGame() {
  const router = useRouter();
  const [coins] = useState(120);
  const [levels, setLevels] = useState<LevelInfo[]>([
    { id: 1, title: "Bullying", completed: false },
    { id: 2, title: "Right to Education", completed: false },
    { id: 3, title: "Good touch Bad touch", completed: false },
  ]);
  const [currentLevel, setCurrentLevel] = useState(1);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const completedLevels = JSON.parse(
      localStorage.getItem("completedLevels") || "[]"
    ) as string[];

    // Update levels completion status
    const updatedLevels = levels.map(level => ({
      ...level,
      completed: completedLevels.includes(level.id.toString())
    }));

    // Determine current level (first uncompleted level)
    const completedCount = completedLevels.length;
    const nextLevel = Math.min(completedCount + 1, levels.length);
    
    setLevels(updatedLevels);
    setCurrentLevel(nextLevel);
  }, [levels.length]);

  const levelData = levels.find(l => l.id === currentLevel);

  // Leaderboard with completion status
  const leaderboard = levels
    .map(l => ({ title: l.title, status: l.completed ? "✅" : "❌" }))
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "✅" ? -1 : 1));

  const playVideo = () => router.push(`/video2/${currentLevel}`);
  const takeQuiz = () => router.push(`/level2/${currentLevel}`);

  if (!levelData) return <div>Loading levels...</div>;

  return (
    <div>
<Navbar></Navbar>
 
    <div className="w-full h-screen overflow-hidden">
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-yellow-200 p-4 flex flex-col">
      {/* Top bar with coins and gift */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-yellow-100 rounded-full px-6 py-3 shadow-md">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-yellow-800 text-xl">$</span>
          </div>
          <span className="font-bold text-yellow-800 text-2xl">{coins}</span>
        </div>
        <div>
          <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center shadow-md">
            <Gift className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Game title */}
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl ml-14 mt-20 font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
        Kidizen
        </h1>
      </div>

      {/* Level list */}
    

      {/* Current Level Actions */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-pink-600 mb-4">
          Level {currentLevel}: {levelData.title}
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
  <Button
    className="w-48 h-16 bg-purple-500 hover:bg-purple-600 rounded-full text-white font-bold text-xl shadow-lg border-2 border-white/50"
    onClick={playVideo}
  >
    Play Video
  </Button>
  
  <Button
    className="w-48 h-16 bg-yellow-600 hover:bg-yellow-600 rounded-full text-white font-bold text-xl shadow-lg border-2 border-white/50"
    onClick={() => router.push("/level-map2")} // or your actual path
  >
    View Levels
  </Button>
</div>


        <div>
<img
  src="trophy.png"
  width={250}
  height={230}
  className=" animate-spin-slow"
  alt="Rotating Trophy"
/>
</div>


      

      {/* Candy decorations */}
      <div className="absolute bottom-1/4 left-1/6 flex space-x-8">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="w-16 h-32 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-white"></div>
            <div className="w-4 h-20 bg-white rounded-full"></div>
          </div>
        ))}
          <div  className="w-16 h-32 flex flex-col items-center ml-155">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-white"></div>
            <div className="w-4 h-20 bg-white rounded-full"></div>
          </div>
          <div  className="w-16 h-32 flex flex-col items-center ">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-white"></div>
            <div className="w-4 h-20 bg-white rounded-full"></div>
          </div>
  
      </div>

      {/* Trophy */}
      <div className="absolute bottom-4 left-4">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Trophy className="h-6 w-6 text-yellow-800" />
        </div>
      </div>

      {/* Bottom bar with social stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">KZ</span>
            </div>
            <div className="ml-2">
              <h3 className="font-bold text-blue-900">Kidizen</h3>
              <p className="text-xs text-black">by AKP</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-black">51.9K</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-black">15.1K</span>
            </div>
            <Flag className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )}