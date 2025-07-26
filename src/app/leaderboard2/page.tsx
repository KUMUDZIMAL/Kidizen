"use client";
import React from 'react'
import Leaderboard from '@/myComponents/Leaderboard2';
import { BrowserRouter } from "react-router-dom"
const page = () => {
  return (
    <BrowserRouter>
    <Leaderboard></Leaderboard>
    </BrowserRouter>
  )
}

export default page
