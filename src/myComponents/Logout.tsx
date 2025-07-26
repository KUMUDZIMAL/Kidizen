"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear all game-related localStorage data
      localStorage.removeItem("gameProgress");
      localStorage.removeItem("completedLevels");
      localStorage.removeItem("lastScore");
      localStorage.removeItem("questionsAnswered");
      localStorage.removeItem("correctAnswers");
      localStorage.removeItem("userData");
      
      // Use window.location for a complete page change instead of router.push
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="gap-2 text-white"
    >
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Log Out"}
    </Button>
  );
}