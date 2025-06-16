"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className="gradient-background">
      <div className="card">
        <h1 className="title">Hello!</h1>
        <p className="text">Welcome to your vocabulary!</p>
        <button
          onClick={handleLoginClick}
          className="button"
        >
          Go to Login
        </button>
        <button
          onClick={handleRegisterClick}
          className="button"
        >
          Go to Register
        </button>
      </div>
    </div>
  );
}
