// src/app/tasks/TasksDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../backend/client/supabaseClient";
import TaskForm from "../../components/TaskForm";
import TaskCard from "../../components/TaskList";
import { Task } from "../../backend/models/taskModel";

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>("");

  // Fetch current user & tasks
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUserId(user.id);

      await fetchTasks(user.id);
    };

    fetchUserAndTasks();
  }, []);

  const fetchTasks = async (uid?: string) => {
    const id = uid || userId;
    if (!id) return;

    const res = await fetch("/api/tasks", { headers: { "x-user-id": id } });
    const data: Task[] = await res.json();
    setTasks(data);
  };

  const handleTaskAdded = () => fetchTasks();

  const handleTaskDeleted = () => fetchTasks();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* Task input form */}
      {userId && <TaskForm userId={userId} onTaskAdded={handleTaskAdded} />}

      {/* Task list */}
      <div className="mt-4 border rounded">
        {tasks.length === 0 ? (
          <p className="p-2 text-gray-500">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userId={userId}
              onDeleted={handleTaskDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
