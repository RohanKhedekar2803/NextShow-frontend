import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Banner from "@/components/ui/Banner";
import GenreButtonList from "@/components/ui/GenreButtonList";

const HomePage = () => {
  const ranOnce = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    if (!localStorage.getItem("token")) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken && refreshToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        const decoded = jwtDecode(accessToken);
        localStorage.setItem("username", decoded.sub);
      }
    }
    window.history.replaceState({}, document.title, "/homepage");

    setReady(true);
  }, []);

  if (!ready) return <div>Starting session...</div>;

  return (
    <>
      <Navbar />
      <Banner />
      <GenreButtonList />
    </>
  );
};

export default HomePage;
