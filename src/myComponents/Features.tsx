"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import pika from '../assets/videos/pika.gif';
import course from '../assets/videos/course.gif';
import chatbot from '../assets/videos/chatbot.gif';
import './Features.css';

const Services = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isTeenUser, setIsTeenUser] = useState(false);
  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include", // Important for cookies
        });
        if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setIsTeenUser(userData.isTeenUser);
      } else {
        setIsAuthenticated(false);
        setIsTeenUser(false);
      }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

 const handlePlayNow = () => {
    if (isAuthenticated) {
      const redirectPath = isTeenUser ? "/sweetworld2" : "/sweetworld";
      router.push(redirectPath);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className='px-4 lg:px-14 max-w-screen-2xl mx-auto my-8 bg-cyan-900' id="ourServices">
      <h1 className='px-4 text-center my-20 mt-0 text-4xl md:text-5xl sm:text-4xl font-bold md:py-3 text-white'>Let's Dive</h1>
      <div className='bg-gray-200'>
        <div className='md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12'>
          <div className='bgm'>
            <Image src={pika} alt="" />
          </div>
          <div className='md:w-4/5 mx-[20px]'>
            <h2 className='text-4xl text-neutral-500 md:w-full'>Play Interactive Games</h2>
            <p className='md:w-full txt-sm text-neutral-400 mb-8'>Play amazing games to learn about the fundamental laws of kids and the country and compete with your friends.</p>
            <button 
              onClick={handlePlayNow}
              className='bg-green-400 w-32 md:w-[200px] rounded-full font-medium py-3 text-black hover:shadow-xl hover:bg-green-600 outline-none focus:outline-none'
            >
              Play Now!!
            </button>
          </div>
        </div>
      </div>
      
      <div className='bg-blue'>
        <div className='md:w-11/12 mx-auto flex flex-col justify-center items-center gap-12 my-32 py-16'>
          <div className='md:w-4/5 mx-[20px] flex flex-col items-center text-center'>
            <h2 className='text-5xl md:text-6xl font-bold text-white md:w-full mb-6'>Make Groups</h2>
            <p className='md:w-full text-lg md:text-2xl text-neutral-400 mb-10'>Create groups and connect with others to collaborate and learn together.</p>
            <Link href="/create-group">
              <button className='bg-green-400 w-40 md:w-[260px] text-lg md:text-2xl rounded-full py-5 text-black hover:shadow-xl hover:bg-green-600 outline-none focus:outline-none'>Make Now</button>
            </Link>
          </div>
        </div>
      </div>

      <div className='bg-pink-100'>
        <div className='md:w-10/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-5 my-20'>
          <div className='bgm'>
            <Image src={chatbot} alt="" />
          </div>
          <div className='md:w-4/5 mx-[10px]'>
            <h2 className='text-4xl text-neutral-500 md:w-full'>Talk to ChatBot</h2>
            <p className='md:w-full txt-sm text-neutral-400 mb-8'>Ask your doubts from the chatbot and get to learn more from it and the internet and know how to protecct yourself from exploitation.</p>
            <Link href="/chatbot">
              <button className='bg-green-400 w-32 md:w-[200px] rounded-full font-medium py-3 text-black hover:shadow-xl hover:bg-green-600 outline-none focus:outline-none'>Let's Chat</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;