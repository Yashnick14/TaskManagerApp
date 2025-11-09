"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterFormInputs } from "../../../backend/models/userModel";
import { registerUser } from "../../../backend/controllers/userController";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    setServerSuccess(null);
    setLoading(true);

    const result = await registerUser(data);

    if (result.error) setServerError(result.error);
    if (result.success) {
      setServerSuccess(result.success);
      reset();
      setTimeout(() => router.push("/auth/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center bg-slate-100 h-full md:min-h-screen p-4">
      <div className="grid justify-center max-w-md mx-auto">
        {/* Left Side Image */}
        <div className="aspect-64/45">
          <img
            src="/images/bg.png"
            className="w-full object-cover rounded-2xl"
            alt="register"
          />
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-6 -mt-24 relative z-10 [box-shadow:0_2px_16px_-3px_rgba(6,81,237,0.3)]"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-blue-600">Create Account</h1>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="relative flex flex-col">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="relative flex flex-col">
              <input
                type="text"
                placeholder="Phone (+94XXXXXXXXX)"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+94\d{9}$/,
                    message:
                      "Phone number must start with +94 and contain 9 digits",
                  },
                })}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative flex flex-col">
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative flex flex-col">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative flex flex-col">
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Server messages */}
            {serverError && (
              <p className="text-red-600 text-sm text-center">{serverError}</p>
            )}
            {serverSuccess && (
              <p className="text-green-600 text-sm text-center">
                {serverSuccess}
              </p>
            )}
          </div>

          <div className="mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-[15px] font-medium tracking-wider rounded-md cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-slate-600 text-sm text-center mt-6">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
