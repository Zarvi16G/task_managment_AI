import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Assuming correct path

export default function LoginView() {
  const { login } = useAuth(); // Destructure the login function

  // 1. Local State to store input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for handling login errors

  // 2. The Submission Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setError("");

    try {
      // 3. Call the context login function with the current state
      console.log("Attempting login with:", { email, password });
      await login({ email, password });

      // The router (App.tsx) will handle the redirection if successful
    } catch (err) {
      // Handle error returned by the API (e.g., wrong credentials)
      setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
      console.error(err);
    }
  };

  const goToSignUp = () => {
    window.location.href = "/signup";
  };

  return (
    // 4. Corrected return syntax and onSubmit handler
    <div className="flex items-center justify-center min-h-screen bg-[#000C19]">
      <div
        // Login form container, using the light background color from your task list
        className="bg-[#CAEAFF] p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-transform duration-300"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1
            // Strong title using the dark blue from your header context
            className="text-4xl text-center text-[#2B6CDD] font-bold font-sans p-2 mb-6 border-b border-gray-300"
          >
            Sign in
          </h1>

          {/* Error Message Display */}
          {error && (
            <p className="text-white bg-red-500 p-3 rounded-lg font-medium">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              // Inputs with focus highlight in the main blue color
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DA8E4] focus:border-[#4DA8E4] transition duration-150 text-[#000C19]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              // Inputs with focus highlight in the main blue color
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DA8E4] focus:border-[#4DA8E4] transition duration-150 text-[#000C19]"
            />
          </div>

          {/* The button triggers the form's onSubmit handler */}
          <button
            type="submit"
            // Primary button using the main blue with hover effect (matching header)
            className="w-full bg-[#4DA8E4] text-white py-3 mt-4 rounded-full font-semibold text-lg transform transition-all duration-200 hover:bg-[#2B6CDD] hover:scale-[1.02] shadow-lg"
          >
            Login
          </button>

          {/* Secondary element: Register button using the bright accent color */}
          <p className="text-center text-sm pt-4 text-[#2B6CDD] font-medium">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={goToSignUp}
            // Secondary button style using the bright accent color from your task list (#00FDA4)
            className="w-full text-[#000C19] bg-[#00FDA4] py-2 rounded-full font-bold text-md transform transition-all duration-200 hover:bg-[#4DA8E4] hover:scale-105 shadow-md"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
