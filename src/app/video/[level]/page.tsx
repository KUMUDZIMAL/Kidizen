"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"

// Map level IDs to video URLs
const videoMap: Record<number, string> = {
  1: "/videos/Right to privacy.mp4",
  2: "/videos/cyberbullying.mp4",
  3: "/videos/rtp.mp4",
}

export default function VideoLevelPage() {
  const params = useParams()
  const router = useRouter()

  // Normalize the `level` param
  const raw = params.level
  const levelStr = Array.isArray(raw) ? raw[0] : raw ?? "1"
  const level = parseInt(levelStr, 10)

  // Pick video URL (fallback to level 1)
  const videoUrl = videoMap[level] ?? videoMap[1]

  const goToQuiz = () => router.push(`/level/${level}`)
  const goBack = () => router.push("/sweetworld")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-emerald-600 p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-white hover:bg-emerald-700/30 transition-colors"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-semibold text-white">Level {level} Video</h1>
          <div className="w-6" />
        </header>

        <div className="p-6">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-inner">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-emerald-600/60 rounded-full p-4">
                <Play size={48} className="text-white opacity-80 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={goToQuiz}
              className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors px-6 py-3 rounded-lg shadow-lg"
            >
              <Play size={20} />
              Take Quiz
            </Button>
            <Button
              variant="outline"
              onClick={goBack}
              className="flex items-center gap-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50 transition-colors px-6 py-3 rounded-lg"
            >
              Back to Levels
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
