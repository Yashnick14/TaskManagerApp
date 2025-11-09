"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../backend/client/supabaseClient";
import { CheckCircle2, X } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-gray-950 to-gray-800 text-white shadow-2xl z-50">
      <div className="flex flex-col h-full pt-6">
        {/* App Title */}
        <div className="px-4 mb-8">
          <h1 className="text-2xl font-bold">Task Manager Pro</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Organize your work efficiently
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/tasks"
            className="flex items-center gap-3 py-3 px-4 rounded-lg bg-linear-to-r from-gray-800 to-gray-700 hover:bg-gray-600 transition-all duration-200"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">All Tasks</span>
          </a>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-linear-to-r from-gray-800 to-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <X size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
