import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTasks, createTask, deleteTask } from "../../../backend/controllers/taskContoller";

// Use service role key for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Add this to your .env

// Create admin client for API routes
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
  const body: unknown = await req.json();
  if (!body || typeof body !== "object" || !("id" in body)) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const taskId = (body as { id: string }).id;
  try {
    await deleteTask(taskId);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id: taskId, is_completed } = body;

  console.log("🔵 PATCH request received:", taskId, is_completed);

  if (!taskId || typeof is_completed !== "boolean") {
    return NextResponse.json({ error: "Task ID and status are required" }, { status: 400 });
  }

  try {
    // Use the admin client directly for the update to bypass any RLS issues
    console.log("🔵 Updating with admin client...");
    
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update({ is_completed })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("❌ Admin update error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No task returned after update");
    }

    console.log("✅ Admin update successful:", data);

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    console.log("🔍 Verification:", verifyData);

    if (verifyError) {
      console.error("⚠️ Verification error:", verifyError);
    } else if (verifyData && verifyData.is_completed !== is_completed) {
      console.error("❗ MISMATCH: Expected", is_completed, "but got", verifyData.is_completed);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ PATCH error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error("❌ PATCH error:", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }
}