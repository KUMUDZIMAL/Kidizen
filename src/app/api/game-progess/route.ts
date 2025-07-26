// app/api/game-progress/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";          // your dbConnect helper
import GameProgress from "@/models/GameProgress";           // your progress schema
import type { IUser } from "@/models/User";

const AUTH_USER_PATH = "/api/auth/user";

// Helper: fetch logged‑in user from your auth endpoint
async function getCurrentUser(req: NextRequest): Promise<IUser> {
  const url = new URL(AUTH_USER_PATH, req.url);
  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return (await res.json()) as IUser;
}

export async function GET(req: NextRequest) {
  try {
    // 1) Authenticate
    const user = await getCurrentUser(req);

    // 2) Connect to MongoDB
    await dbConnect();

    // 3) Fetch or return empty template
    const progress = await GameProgress.findOne({ userId: user._id });
    return NextResponse.json(progress || {
      userId: user._id,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalPoints: 0,
      totalLevelsCompleted: 0,
      levels: [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    const {
      levelId,
      score,
      totalQuestions,
      correctAnswers,
      isLevelCompleted,
    } = body as {
      levelId: number;
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      isLevelCompleted: boolean;
    };

    await dbConnect();

    // Build update operators
    const updateOps: any = {
      $inc: {
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers: correctAnswers,
        totalPoints: score,
        "levels.$.attempts": 1,
      },
    };
    const setOps: any = {};

    if (isLevelCompleted) {
      updateOps.$inc.totalLevelsCompleted = 1;
      setOps["levels.$.completed"]   = true;
      setOps["levels.$.completedAt"] = new Date();
    }

    // Upsert the per‐level entry if missing
    // First ensure the level array has an entry for this level
    await GameProgress.updateOne(
      { userId: user._id, "levels.levelId": { $ne: levelId } },
      { $push: { levels: { levelId, attempts: 0, correctAnswers: 0, incorrectAnswers: 0, completed: false } } }
    );

    // Now update the matching level
    await GameProgress.updateOne(
      { userId: user._id, "levels.levelId": levelId },
      {
        ...updateOps,
        $set: {
          ...setOps,
          "levels.$.correctAnswers": correctAnswers,
          "levels.$.incorrectAnswers": totalQuestions - correctAnswers,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("GameProgress POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
