import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpData, setOtpData] = useState({
    otp: null,
    userid: location.state.userid,
  });
  const [error, setError] = useState(false);
  const handleOtp = async () => {
    console.log(otpData)
    try {
      const res = await fetch("https://real-estate-market-backend.onrender.com/api/v1/user/email/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });
      const data = await res.json();
      if (data.msg) {
        setError(true);
      } else {
        setError(false);
        navigate("/login");
      }
    } catch (error) {
      setError(true);
      console.log(error.message);
    }
  };
  return (
    <div className="p-9">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl text-slate-800">
          Verifiction code is sent to your email
        </h1>
        <input
          type="number"
          id="otp"
          placeholder="otp"
          className="border p-3 rounded-lg m-3"
          onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
        ></input>
        <button
          onClick={handleOtp}
          className="p-4 bg-slate-800 text-white font-semibold cursor-pointer rounded-lg hover:bg-slate-900"
        >
          Confirm
        </button>
        {error && <p className="text-red-700 font-semibold">Invalid code</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
