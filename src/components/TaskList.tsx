"use client";

import { useState, useEffect } from "react";
import { Task } from "../backend/models/taskModel";
import { Trash2 } from "lucide-react";

interface Props {
  task: Task;
  userId: string;
  onDeleted: (taskId: string) => void;
  onToggleComplete?: (task: Task) => Promise<Task>;
}

export default function TaskCard({ task, onDeleted, onToggleComplete }: Props) {
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsCompleted(task.is_completed);
  }, [task.is_completed]);

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

  const handleComplete = async () => {
    if (!onToggleComplete || isUpdating || isCompleted) return;
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
    <div className="bg-white/10 border border-white/20 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200 backdrop-blur-md flex items-center">
      {/* Left Section: Checkbox + Title */}
      <div className="flex items-start gap-3 flex-1">
        <div
          onClick={!isCompleted && !isUpdating ? handleComplete : undefined}
          className={`w-6 h-6 flex items-center justify-center rounded-md border-2 mt-1 transition cursor-pointer
            ${
              isCompleted
                ? "bg-green-500 border-green-500 cursor-not-allowed"
                : "border-gray-400 hover:border-blue-500"
            }`}
        >
          {isCompleted && (
            <span className="text-white text-sm font-bold">✓</span>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-gray-700">{task.title}</h3>

          {/* Status below title */}
          <p className="text-sm text-gray-300 mt-1">
            <span className="font-medium text-gray-400">Status:</span>{" "}
            <span
              className={`${
                isCompleted ? "text-green-500" : "text-yellow-500"
              } font-semibold`}
            >
              {isCompleted ? "Completed" : "Pending"}
            </span>
          </p>
        </div>
      </div>

      {/* Center: Created On */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-500">Created on:</span>{" "}
          {new Date(task.inserted_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Right Section: Delete button */}
      <div className="flex items-center">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
