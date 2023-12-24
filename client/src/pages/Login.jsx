import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/UserSlice";
import { OAuth } from "../components/OAuth";
const Login = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    const res = await fetch(`${REACT_APP_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.msg) {
      dispatch(signInFailure(data.msg));
      return;
    }
    dispatch(signInSuccess(data));
    navigate("/");
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign in</h1>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={HandleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={HandleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-900 disabled:opacity-70"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-blue-900 font-semibold">Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
