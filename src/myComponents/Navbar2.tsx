// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  PlayCircle,
  LayoutDashboard,
  Trophy,
  Users,
  MessageSquare,
  Bot,
  LogOut,
} from "lucide-react";

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear(); // Clears all localStorage items
      router.push("/"); // Redirects to the home page
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-teal-600 font-medium hover:text-teal-800 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isTeenUser, setIsTeenUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState("/");

  // listen for scroll and auth status
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    // fetch auth & teen status
    Promise.all([
      fetch("/api/auth/status").then(r => r.json()),
      fetch("/api/auth/user", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
    ]).then(([stat, user]) => {
      setIsAuthenticated(stat.isAuthenticated);
      setIsTeenUser((user as any).isTeenUser);
      setIsLoading(false);
    });

    // set initial active link
    setActiveLink(window.location.pathname);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Play", href: isTeenUser ? "/sweetworld2" : "/sweetworld", icon: PlayCircle },
    { name: "Dashboard", href: isTeenUser ? "/dashboard2" : "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", href: isTeenUser ? "/leaderboard2" : "/leaderboard", icon: Trophy },
    { name: "Community", href: "/create-group", icon: Users },
    ...(isTeenUser ? [] : [{ name: "Forum", href: "/forum", icon: MessageSquare }]),
    { name: "Chatbot", href: "/chatbot", icon: Bot },
  ];

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-300
        ${scrolled ? "backdrop-blur-lg shadow-xl" : ""}
      `}
    >
      <div
        className={`
          max-w-6xl mx-auto flex items-center justify-between
          px-6 h-16 rounded-full
          bg-cyan-900
        `}
      >
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-pink-500">Kidizen</span>
        </Link>

        <nav className="flex space-x-2 md:space-x-4">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setActiveLink(href)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${
                  activeLink === href
                    ? "bg-white text-teal-600 shadow-md scale-105"
                    : "text-white hover:bg-white/20"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{name}</span>
            </Link>
          ))}
        </nav>

        <div>
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-teal-400" />
          ) : isAuthenticated ? (
            <div className="rounded-full bg-white px-4 py-1.5 shadow-md">
              <LogoutButton />
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                href="/auth/login"
                className="rounded-full  bg-green-700 px-4 py-1.5 font-bold text-white shadow-md hover:bg-yellow-500"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-blue-600 px-4 py-1.5 font-bold text-white shadow-md hover:bg-pink-500"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
