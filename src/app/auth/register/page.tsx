"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, age, gender, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/auth/login");
    } catch {
      setError("An error occurred during registration");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white overflow-hidden">
      {/* Subtle Blurred Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-400/40 rounded-full blur-2xl animate-blob1"></div>
        <div className="absolute top-[5%] right-[-5%] w-80 h-80 bg-purple-300/40 rounded-full blur-2xl animate-blob2"></div>
        <div className="absolute bottom-[-15%] left-[15%] w-64 h-64 bg-purple-300/40 rounded-full blur-2xl animate-blob3"></div>
      </div>

      {/* Registration Card */}
      <div className="relative z-10 w-80 rounded-2xl bg-white/90 px-6 py-8 backdrop-blur-sm shadow-lg">
        <h2 className="mb-4 text-center text-3xl font-bold text-purple-600">
          Sign Up
        </h2>
        {error && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
              placeholder="Choose a fun name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
              placeholder="yourname@example.com"
              required
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age !== null ? age : ""}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : null)
              }
              className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
              placeholder="How old are you?"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full appearance-none rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 focus:border-purple-600 focus:bg-white focus:outline-none transition"
            >
              <option value="">Select</option>
              <option value="male">Boy</option>
              <option value="female">Girl</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-800 placeholder-gray-600 focus:border-purple-600 focus:bg-white focus:outline-none transition"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-lg font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
