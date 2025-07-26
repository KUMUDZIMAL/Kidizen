"use client";
import React from 'react'
import QuizLevel from '@/myComponents/QuizLevel';
import { BrowserRouter } from "react-router-dom";
const page = () => {
  return (
 
      <BrowserRouter>
   <QuizLevel></QuizLevel>
      </BrowserRouter>
    
  )
}

export default page