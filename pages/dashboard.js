// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect if no token found
    } else {
      // Fetch user details (optional)
      // Example: Fetch user data from your backend
    }
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <p>Welcome {user.name}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;
