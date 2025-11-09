"use client";

import { useState, useEffect } from "react";
import { Task } from "../backend/models/taskModel";
import { Trash2, CheckCircle2 } from "lucide-react";

interface Props {
  task: Task;
  userId: string;
  onDeleted: (taskId: string) => void;
  onToggleComplete?: (task: Task) => Promise<Task>; // ✅ Return updated Task
}

export default function TaskCard({ task, onDeleted, onToggleComplete }: Props) {
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state when task prop changes
  useEffect(() => {
    setIsCompleted(task.is_completed);
  }, [task.is_completed]);

  // ✅ Handle delete
  const handleDelete = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id }),
      });

      if (!res.ok) throw new Error("Failed to delete task");
      onDeleted(task.id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ Handle complete
  const handleComplete = async () => {
    if (!onToggleComplete || isCompleted) return; // ✅ Disable if already completed
    setIsUpdating(true);

    try {
      const updatedTask = await onToggleComplete(task);
      setIsCompleted(updatedTask.is_completed);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        {/* Left Section (Custom Checkbox + Task Info) */}
        <div className="flex items-start gap-3">
          {/* Custom Checkbox */}
          <div
            onClick={handleComplete}
            className={`w-6 h-6 flex items-center justify-center rounded-md border-2 cursor-pointer mt-1 transition 
              ${
                isCompleted
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400 hover:border-blue-500"
              }`}
          >
            {isCompleted && (
              <span className="text-white text-sm font-bold">✓</span>
            )}
          </div>

          {/* Task Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              Created on:{" "}
              {new Date(task.inserted_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            {/* ✅ Removed debug ID line */}
          </div>
        </div>

        {/* Right Section (Status + Buttons) */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {isCompleted ? "Completed" : "Pending"}
          </span>

          <button
            onClick={handleComplete}
            disabled={isUpdating || isCompleted} // ✅ Disabled if already completed
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${
              isCompleted
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <CheckCircle2 size={16} />
            {isUpdating ? "Saving..." : isCompleted ? "Completed" : "Complete"}
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
