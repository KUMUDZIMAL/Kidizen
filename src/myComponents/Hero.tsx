// src/components/Hero.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "react-scroll";
import { useRouter } from "next/navigation";
import heroImage from "../assets/hero.jpeg";
import "./hero.css";
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isTeenUser, setIsTeenUser] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
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
        setIsTeenUser(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const redirectPath = isTeenUser ? "/sweetworld2" : "/sweetworld";
      router.push(redirectPath);
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <div className="hero-container">
      <div className="overlay" />
      <Image
        src={heroImage}
        alt="Background"
        fill
        className="hero-image"
        priority
      />
      <div className="hero-content">
        <p className="hero-subtitle font-kid text-kid-yellow">
          Let's Stand for Ourselves with
        </p>
        <h1 className="hero-title font-kid">
          <span className="text-kid-pink">Kidizen</span>
        
        </h1>
        <div className="hero-tagline">
          <p className="font-kid text-kid-base">Become the informed kid in the society with</p>
          <p className="text-kid-blue font-kid font-bold">Everyone</p>
        </div>
        <div className="hero-button">
          <Button 
            onClick={handleGetStarted} 
            variant="kid"
            size="lg"
            className="text-kid-lg font-kid font-bold px-8 py-4"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;