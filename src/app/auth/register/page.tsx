"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../backend/client/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      // Redirect to login page after successful sign up
      router.push("/auth/login");
    } catch (err: unknown) {
      // Proper type narrowing instead of `any`
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
