"use client";
import React from 'react'
import GameMap from '@/myComponents/GameMap'
import { BrowserRouter } from "react-router-dom";

const page = () => {
  return (
 
      <BrowserRouter>
 <GameMap></GameMap>     
 </BrowserRouter>

  )
}

export default page
