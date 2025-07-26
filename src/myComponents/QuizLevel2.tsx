"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import type { Quiz, AnswerLabel } from "@/types/quiz"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle } from 'lucide-react'

export default function QuizLevel() {
  const videoMap: Record<string, string> = {
    "1": "/videos/bullying.mp4",
    "2": "/videos/RTE.mp4",
    "3": "/videos/gtbt.mp4",
  }

  const { levelId } = useParams<{ levelId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerLabel | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Load saved progress for this level on mount
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("gameProgress") || "{}")
    const prog = all[`level_${levelId}`]
    if (prog) {
      setScore(prog.score)
      setCurrentQuestion(prog.currentQuestion)
    }
  }, [levelId])

  useEffect(() => {
    if (typeof window === "undefined") return
    ;(async () => {
      if (!levelId || !videoMap[levelId]) {
        setError("Invalid level or missing video.")
        setLoading(false)
        return
      }
      try {
        const res = await fetch(videoMap[levelId])
        if (!res.ok) throw new Error("Failed to load video.")
        const blob = await res.blob()
        const file = new File([blob], `${levelId}.mp4`, { type: "video/mp4" })
        const body = new FormData()
        body.append("file", file)
        const qres = await fetch("http://127.0.0.1:5000/api/quiz", { method: "POST", body })
        if (!qres.ok) throw new Error("Quiz generation failed.")
        const data: Quiz = await qres.json()
        setQuiz(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [levelId])

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} />
  if (!quiz) return <p className="text-center mt-10 text-gray-700">No quiz available.</p>

  const q = quiz.questions[currentQuestion]

  const saveProgress = (newScore: number, newQIdx: number) => {
    const all = JSON.parse(localStorage.getItem("gameProgress") || "{}")
    all[`level_${levelId}`] = { score: newScore, currentQuestion: newQIdx }
    localStorage.setItem("gameProgress", JSON.stringify(all))
  }

  const selectAnswer = (lbl: AnswerLabel) => {
    if (isAnswered) return
    setSelectedAnswer(lbl)
    setIsAnswered(true)
    const correct = lbl === q.correctAnswer
    setLastCorrect(correct)
    if (correct) setScore((s) => s + 1)
    toast({ title: correct ? "Correct!" : "Incorrect", description: correct ? "Well done!" : `Answer: ${q.options[q.correctAnswer]}`, variant: correct ? "default" : "destructive" })
    saveProgress(score + (correct ? 1 : 0), currentQuestion)
  }

  const nextQ = () => {
    const nextIdx = currentQuestion + 1
    if (nextIdx < quiz.questions.length) {
      setCurrentQuestion(nextIdx)
      setIsAnswered(false)
      setSelectedAnswer(null)
      setLastCorrect(null)
      saveProgress(score, nextIdx)
    } else {
      // Mark level complete
      const done = JSON.parse(localStorage.getItem("completedLevels") || "[]")
      if (!done.includes(levelId)) {
        done.push(levelId)
        localStorage.setItem("completedLevels", JSON.stringify(done))
      }
      finalizeStats(score, quiz.questions.length)
      // Remove in-progress data
      const all = JSON.parse(localStorage.getItem("gameProgress") || "{}")
      delete all[`level_${levelId}`]
      localStorage.setItem("gameProgress", JSON.stringify(all))
      setShowResults(true)
    }
  }

  const questionProgress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center py-10 px-4">
      {!showResults ? (
        <div className="w-full max-w-3xl">
          <QuizHeader levelId={levelId} index={currentQuestion} total={quiz.questions.length} />
          <Progress value={questionProgress} className="h-4 rounded mb-8 bg-gray-200" />
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-white px-6 py-4 border-b">
              <CardTitle className="text-2xl font-semibold text-gray-900">{q.text}</CardTitle>
            </CardHeader>
            <CardContent className="bg-white px-6 py-6 space-y-4">
              {(["A","B","C","D"] as AnswerLabel[]).map((lbl) => {
                const isCorrect = lbl === q.correctAnswer
                const isSelected = lbl === selectedAnswer
                const bgClass = isAnswered && isSelected
                  ? isCorrect ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600'
                  : 'bg-white border-gray-300 hover:border-emerald-600'
                return (
                  <button key={lbl} onClick={() => selectAnswer(lbl)} disabled={isAnswered}
                    className={`w-full flex justify-between items-center px-5 py-4 border-2 rounded-lg font-medium text-gray-900 ${bgClass}`}
                  >
                    <span>{q.options[lbl]}</span>
                    {isAnswered && isSelected && (isCorrect
                      ? <CheckCircle size={20} className="text-green-600" />
                      : <XCircle size={20} className="text-red-600" />)}
                  </button>
                )
              })}
            </CardContent>
            {isAnswered && (
              <CardFooter className="bg-white px-6 py-4 flex justify-end">
                <Button onClick={nextQ} className="px-6 py-2 bg-emerald-600">
                  {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      ) : (
        <ResultsCard score={score} total={quiz.questions.length} onBack={() => router.push("/sweetworld2")} />
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <p className="text-lg text-emerald-700">Loading quiz...</p>
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <p className="text-lg text-red-600">{message}</p>
    </div>
  )
}

function QuizHeader({ levelId, index, total }: { levelId: string; index: number; total: number }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold text-emerald-800">Level {levelId} Quiz</h1>
      <p className="text-lg text-gray-700">{index + 1} / {total}</p>
    </div>
  )
}

function finalizeStats(score: number, total: number) {
  const updateStat = (key: string, value: number) => {
    const current = parseInt(localStorage.getItem(key) || "0", 10)
    localStorage.setItem(key, (current + value).toString())
  }
  updateStat("totalPoints", score * 100)
  updateStat("questionsAnswered", total)
  updateStat("correctAnswers", score)
  updateStat("quizCount", 1)
}

function ResultsCard({ score, total, onBack }: { score: number; total: number; onBack: () => void }) {
  const pct = (score / total) * 100
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-emerald-800 mb-4">Quiz Completed!</h2>
      <p className="text-lg text-gray-700 mb-4">
        Your Score: <span className="font-semibold text-emerald-900">{score} / {total}</span>
      </p>
      <div className="w-full h-4 mb-6 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
      <Button onClick={onBack} className="mt-4 px-6 py-2 bg-emerald-600">
        Back to Levels
      </Button>
    </div>
  )
}
