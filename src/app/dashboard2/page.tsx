"use client";
import React from 'react'
import Dashboard from '@/myComponents/Dashboard2';
import { BrowserRouter } from "react-router-dom";
const page = () => {
  return (
    <div>
      <BrowserRouter>
   <Dashboard></Dashboard>
      </BrowserRouter>
    </div>
  )
}

export default page