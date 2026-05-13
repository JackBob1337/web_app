import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";

const useProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        setError("User not authenticated");
        setUserInfo(null);
        return;
      }

      const response = await fetch("http://localhost:8000/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched user info:", data);

      if (!response.ok) {
        setError(data.detail || "Could not fetch user info");
        setUserInfo(null);
        return;
      }

      setUserInfo(data);
    } catch (err) {
      setError("Network error");
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};

export default useProfile;