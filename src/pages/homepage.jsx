import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Banner from "@/components/ui/Banner";
import GenreButtonList from "@/components/ui/GenreButtonList";
import { getUserId } from "@/Services/auth";
const HomePage = () => {
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    if(localStorage.getItem("token") && localStorage.getItem("refresh_token")){
      console.log("via username password")
    }else{
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
  
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");
  
      if (!accessToken || !refreshToken) {
        console.warn("Tokens missing in URL");
        return;
      }
  
      // ⚠️ DEV ONLY
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
  
      const decoded = jwtDecode(accessToken);
      localStorage.setItem("username", decoded.sub);
  
      // 🔥 MUST clean URL immediately
      window.history.replaceState({}, document.title, "/homepage");
      window.location.reload();
    }


  }, []);

  return (
    <>
      <Navbar />
      <Banner />
      <GenreButtonList />
    </>
  );
};


export default HomePage;
