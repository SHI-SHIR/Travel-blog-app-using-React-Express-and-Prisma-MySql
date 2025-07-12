import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navabr from "./Navbar";

const Login = () => {
  const host = "https://mern-travel-blog-web-app.onrender.com";
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //API call
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      navigate("/"); //redirecting to home page
    } else {
      alert("Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>

    <Navabr />
      <div className="flex flex-col justify-center items-center h-screen v-screen">
        <h1 className="text-3xl mt-30 mb-3"> Log In</h1>
        <form
          action="/create"
          method="post"
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="floatingInput">Email address</label>
            <input
              type="email"
              className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
              value={credentials.email}
              name="email"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={onChange}
            />
            
          </div>
          <div>
            <label htmlFor="floatingPassword">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
              value={credentials.password}
              name="password"
              id="floatingPassword"
              placeholder="Password"
              onChange={onChange}
            />
            

            <button type="submit" className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg cursor-pointer mt-4">
              Log in
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
