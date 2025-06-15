"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Our Website!</h1>
      <button
        onClick={handleLoginClick}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Go to Login
      </button>
      <button
        onClick={handleRegisterClick}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Go to Register
      </button>
    </div>
  );
};

export default Home;
