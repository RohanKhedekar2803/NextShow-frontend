import React from 'react'
import Navbar from '@/components/ui/Navbar'
import { Form } from '@/components/ui/form'
import Banner from '@/components/ui/banner'
import EventList from '@/components/ui/EventList'
import GenreButtonList from '@/components/ui/GenreButtonList'


const HomePage = () => {
  return (
    <>
        <Navbar />
        <Banner />
        <GenreButtonList />
    </>
  )
}

export default HomePage
