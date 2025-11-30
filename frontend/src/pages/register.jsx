import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await registerUser(form);
      setSuccess("Account created successfully!");

      setTimeout(() => (window.location.href = "/login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-72 h-72 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-green-200 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-emerald-200 rounded-full opacity-50 blur-2xl"></div>

        {/* Main Card */}
        <div className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-green-100">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-4xl">🌿</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs">✨</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Begin Your Journey
            </h2>
            <p className="text-gray-600 text-sm">Create your Ayurveda wellness account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm">
              <span className="font-semibold">Success!</span> {success}
            </div>
          )}

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔐</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 pl-1">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                I agree to the{" "}
                <button className="text-green-600 hover:underline font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-green-600 hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <span className="text-xl">🔍</span>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </div>

          {/* Decorative Bottom Element */}
          <div className="mt-6 pt-6 border-t border-green-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🧘</span>
              <p className="text-center text-xs text-gray-500">
                Join thousands on their path to wellness
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}