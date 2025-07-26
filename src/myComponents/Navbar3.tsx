// DEPRECATED: Use Navbar2.tsx for the unified Navbar across the app.
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
      localStorage.clear();
      router.push("/");
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

export default function Navbar2() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isTeenUser, setIsTeenUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    // Add a scroll listener if you want a shadow when the user scrolls
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    // Fetch authentication status & whether the user is a teen
    Promise.all([
      fetch("/api/auth/status").then((r) => r.json()),
      fetch("/api/auth/user", { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({})),
    ]).then(([stat, user]) => {
      setIsAuthenticated(stat.isAuthenticated);
      setIsTeenUser((user as any).isTeenUser);
      setIsLoading(false);
    });

    // Mark the current path as active for highlighting
    setActiveLink(window.location.pathname);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // nav items change slightly if isTeenUser
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    {
      name: "Play",
      href: isTeenUser ? "/sweetworld2" : "/sweetworld",
      icon: PlayCircle,
    },
    {
      name: "Dashboard",
      href: isTeenUser ? "/dashboard2" : "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Leaderboard",
      href: isTeenUser ? "/leaderboard2" : "/leaderboard",
      icon: Trophy,
    },
    { name: "Community", href: "/create-group", icon: Users },
    ...(isTeenUser
      ? []
      : [{ name: "Forum", href: "/forum", icon: MessageSquare }]),
    { name: "Chatbot", href: "/chatbot", icon: Bot },
  ];

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        bg-white                    /* ← Make the entire header white */
        transition-shadow duration-300
        ${scrolled ? "shadow-md" : ""}
      `}
    >
      <div
        className={`
          max-w-6xl mx-auto flex items-center justify-between
          px-6 h-16
        `}
      >
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold text-teal-600">
          <span className="text-pink-400">KID</span>vocate
        </Link>

        {/* Navigation Links */}
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
                    ? "bg-teal-100 text-teal-600 shadow-sm"
                    : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{name}</span>
            </Link>
          ))}
        </nav>

        {/* Login / Logout area */}
        <div>
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-teal-200" />
          ) : isAuthenticated ? (
            <div className="rounded-full bg-teal-50 px-4 py-1.5 shadow-sm">
              <LogoutButton />
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                href="/auth/login"
                className="rounded-full bg-yellow-400 px-4 py-1.5 font-bold text-white shadow-md hover:bg-yellow-500"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-pink-400 px-4 py-1.5 font-bold text-white shadow-md hover:bg-pink-500"
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
