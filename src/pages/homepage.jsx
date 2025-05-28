import React from 'react'
import Navbar from '@/components/ui/Navbar'
import { Form } from '@/components/ui/form'
import Banner from '@/components/ui/banner'
import EventList from '@/components/ui/EventList'
import GenreButtonList from '@/components/ui/GenreButtonList'
import{  useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // Extract token from URL fragment
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=([^&]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      console.log("JWT token from URL fragment:", token);
      localStorage.setItem('token', token); // Store for later use
      // Optional: remove token from URL for cleanliness
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);
  return (
    <>
        <Navbar />
        <Banner />
        <GenreButtonList />
    </>
  )
}

export default HomePage
