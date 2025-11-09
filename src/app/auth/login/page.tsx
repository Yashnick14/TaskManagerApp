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
    <div className="flex justify-center items-center bg-slate-100 h-full md:min-h-screen p-4">
      <div className="grid justify-center max-w-md mx-auto">
        {/* Image */}
        <div className="aspect-64/45">
          <img
            src="/images/bg.png"
            className="w-full object-cover rounded-2xl"
            alt="login-image"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="bg-white rounded-2xl p-6 -mt-24 relative z-10 [box-shadow:0_2px_16px_-3px_rgba(6,81,237,0.3)]"
        >
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-blue-600">Sign in</h1>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 pr-8 outline-none"
                placeholder="Enter email"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-[18px] h-[18px] absolute right-2"
                viewBox="0 0 682.667 682.667"
              >
                <g transform="matrix(1.33 0 0 -1.33 0 682.667)">
                  <path
                    fill="none"
                    strokeMiterlimit="10"
                    strokeWidth="40"
                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  />
                </g>
              </svg>
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 pr-8 outline-none"
                placeholder="Enter password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                viewBox="0 0 128 128"
              >
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104z" />
              </svg>
            </div>
          </div>

          {/* Button */}
          <div className="mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-[15px] font-medium tracking-wider rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-slate-600 text-sm text-center mt-6">
              Don&apos;t have an account{" "}
              <a
                href="/auth/register"
                className="text-blue-600 font-medium hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
