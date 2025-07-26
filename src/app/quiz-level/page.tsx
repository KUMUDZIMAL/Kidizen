import React from 'react'
import QuizLevel from '@/myComponents/QuizLevel'
import { BrowserRouter } from "react-router-dom";
const page = () => {
  return (
    <div>
      <BrowserRouter>
      <QuizLevel></QuizLevel>
      </BrowserRouter>
    </div>
  )
}

export default page
