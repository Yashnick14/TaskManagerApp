import { supabase } from "../client/supabaseClient";
import { Task } from "../models/taskModel";

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("inserted_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTask(userId: string, title: string): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ is_completed: isCompleted })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
