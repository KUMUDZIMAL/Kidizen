"use client";
import React from 'react'
import QuizLevel from '@/myComponents/QuizLevel2';
import { BrowserRouter } from "react-router-dom";
const page = () => {
  return (
 
      <BrowserRouter>
   <QuizLevel></QuizLevel>
      </BrowserRouter>
    
  )
}

export default page