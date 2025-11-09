"use client";

import { useForm } from "react-hook-form";
import { Task } from "../backend/models/taskModel";
import { useState } from "react";
import { createTask } from "../backend/controllers/taskContoller";

interface Props {
  userId: string;
  onTaskAdded: (task: Task) => void;
  onClose: () => void;
}

export default function TaskFormView({ userId, onTaskAdded, onClose }: Props) {
  const { register, handleSubmit, reset } = useForm<{ title: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: { title: string }) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const title = data.title.trim();
    if (!title) return alert("Task title cannot be empty");

    try {
      setIsSubmitting(true);
      const newTask = await createTask(userId, title);
      onTaskAdded(newTask);
      reset();
      setTimeout(onClose, 500);
    } catch (err: unknown) {
      console.error(
        "Failed to add task:",
        err instanceof Error ? err.message : err
      );
      alert("Failed to add task");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title
        </label>
        <input
          {...register("title", { required: true })}
          placeholder="Enter your task..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
        <button
          onClick={onClose}
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
