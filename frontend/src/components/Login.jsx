import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const host = process.env.REACT_APP_API_HOST || "http://localhost:5000";
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        navigate("/");
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen font-space">
        <h1 className="text-3xl mt-10 mb-3">Log In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
              value={credentials.email}
              name="email"
              id="email"
              placeholder="name@example.com"
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
              value={credentials.password}
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              required
            />
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-5 py-3 text-white text-lg font-semibold rounded-lg mt-4 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
