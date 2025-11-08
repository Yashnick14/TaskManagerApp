// src/app/components/TaskCard.tsx
"use client";
import { Task } from "../backend/models/taskModel";

interface Props {
  task: Task;
  userId: string;
  onDeleted: () => void;
}

export default function TaskCard({ task, userId, onDeleted }: Props) {
  const handleDelete = async () => {
    await fetch(`/api/tasks?id=${task.id}`, {
      method: "DELETE",
      headers: { "x-user-id": userId },
    });
    onDeleted();
  };

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span>{task.title}</span>
      <button onClick={handleDelete} className="text-red-500">
        Delete
      </button>
    </div>
  );
}
