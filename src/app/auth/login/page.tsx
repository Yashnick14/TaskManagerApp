"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../backend/client/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setError(error?.message || "");
    setLoading(false);

    if (!error) router.push("/tasks");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          className="border p-2 w-full mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
