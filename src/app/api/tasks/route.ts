import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask, deleteTask, toggleTask } from "../../../backend/controllers/taskContoller";

interface CreateTaskBody {
  title: string;
}

function isCreateTaskBody(obj: unknown): obj is CreateTaskBody {
  return typeof obj === "object" && obj !== null && "title" in obj && typeof (obj as Record<string, unknown>).title === "string";
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const tasks = await getTasks(userId);
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json();
  if (!isCreateTaskBody(body)) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  try {
    const task = await createTask(userId, body.title);
    return NextResponse.json(task);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("id");
  if (!taskId) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

  try {
    await deleteTask(taskId);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("id");
  const isCompletedParam = searchParams.get("is_completed");

  if (!taskId || isCompletedParam === null) {
    return NextResponse.json({ error: "Task ID and status are required" }, { status: 400 });
  }

  const isCompleted = isCompletedParam === "true";

  try {
    const task = await toggleTask(taskId, isCompleted);
    return NextResponse.json(task);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
