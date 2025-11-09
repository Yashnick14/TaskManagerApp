"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../backend/client/supabaseClient";
import TaskFormView from "../../components/TaskForm";
import TaskCard from "../../components/TaskList";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Task } from "../../backend/models/taskModel";
import {
  getTasks,
  toggleTask,
  deleteTask,
} from "../../backend/controllers/taskContoller";
import { PlusCircle, CheckCircle2, Clock, X } from "lucide-react";

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUserId(user.id);
      setUserEmail(user.email || "");
      await fetchTasks(user.id);
    };

    fetchUser();
  }, []);

  const fetchTasks = async (uid?: string) => {
    try {
      const id = uid || userId;
      if (!id) return;
      const data = await getTasks(id);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskAdded = (task: Task) => setTasks((prev) => [task, ...prev]);

  const handleToggleComplete = async (task: Task): Promise<Task> => {
    const updated = await toggleTask(task.id, !task.is_completed);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    return updated;
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={userEmail} />
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 pt-6">
        <div className="max-w-6xl mx-auto px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {tasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-indigo-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {pendingCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
              <p className="text-gray-600 mt-1">
                Manage and track your daily tasks
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-medium shadow-lg shadow-indigo-200"
            >
              <PlusCircle size={20} />
              Add Task
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first task to get organized!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add Your First Task
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userId={userId}
                  onDeleted={handleTaskDeleted}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-all p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <TaskFormView
                userId={userId}
                onTaskAdded={handleTaskAdded}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
