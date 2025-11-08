// src/app/components/TaskForm.tsx
"use client";
import { useForm } from "react-hook-form";

interface Props {
  userId: string;
  onTaskAdded: () => void;
}

export default function TasksForm({ userId, onTaskAdded }: Props) {
  const { register, handleSubmit, reset } = useForm<{ title: string }>();

  const onSubmit = async (data: { title: string }) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(data),
    });
    reset();
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        {...register("title")}
        placeholder="New task"
        className="border p-2 flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded">
        Add
      </button>
    </form>
  );
}
