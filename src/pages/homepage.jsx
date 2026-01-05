import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Banner from "@/components/ui/Banner";
import GenreButtonList from "@/components/ui/GenreButtonList";
import {getuserid}  from "@/Services/auth";


const HomePage = () => {
  useEffect(() => {
    const handleAuthFlow = async () => {
      const hash = window.location.hash;
      const tokenMatch = hash.match(/token=([^&]+)/);

      if (!tokenMatch) return;

      const token = tokenMatch[1];

      // 1️⃣ Store JWT
      localStorage.setItem("token", token);

      // 2️⃣ Decode username
      const decoded = jwtDecode(token);
      const username = decoded.sub;

      localStorage.setItem("username", username);

      // 3️⃣ Fetch userId from backend (WAIT for it)
      try {
        const userId = await getuserid(username);

        if (userId) {
          localStorage.setItem("user_id", userId.toString());
        } else {
          console.error("User ID not found for username:", username);
        }
      } catch (err) {
        console.error("Failed to fetch userId:", err);
      }

      // 4️⃣ Clean URL
      window.history.replaceState(null, null, window.location.pathname);

      window.location.reload();
    };

    handleAuthFlow();
  }, []);

  return (
    <>
      <Navbar />
      <Banner />
      <GenreButtonList />
    </>
  );
};

export default HomePage