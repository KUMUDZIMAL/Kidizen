"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import Link from "next/link"
import { Home, PlayCircle, LayoutDashboard, Trophy, Users, MessageSquare, Bot, LogOut } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

// Create a simple LogoutButton component to replace the imported one
function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        // Notify other tabs about logout
        localStorage.setItem("authChange", Date.now().toString())
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-teal-600 font-medium hover:text-teal-800 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </button>
  )
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isTeenUser, setIsTeenUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLink, setActiveLink] = useState("/")
  const [scrolled, setScrolled] = useState(false)

  const checkIsAuthenticated = async () => {
    try {
      const res = await fetch("/api/auth/status")
      const data = await res.json()
      setIsAuthenticated(data.isAuthenticated)
    } catch (err) {
      console.error("Failed to check auth status:", err)
      setIsAuthenticated(false)
    }
  }

  const fetchTeenStatus = async () => {
    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setIsTeenUser(data.isTeenUser)
      } else {
        setIsTeenUser(false)
      }
    } catch (error) {
      console.error("Authentication check failed:", error)
      setIsTeenUser(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkIsAuthenticated()
    fetchTeenStatus()

    const handleFocus = () => {
      checkIsAuthenticated()
      fetchTeenStatus()
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authChange" || event.key === "userLoggedIn") {
        checkIsAuthenticated()
        fetchTeenStatus()
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("scroll", handleScroll)

    // Set active link based on current path
    const path = window.location.pathname
    setActiveLink(path)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Play", href: isTeenUser ? "/sweetworld2" : "/sweetworld", icon: PlayCircle },
    { name: "Dashboard", href: isTeenUser ? "/dashboard2" : "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", href: isTeenUser ? "/leaderboard2" : "/leaderboard", icon: Trophy },
    { name: "Community", href: "/create-group", icon: Users },
    ...(isTeenUser ? [] : [{ name: "Forum", href: "/forum", icon: MessageSquare }]),
    { name: "Chatbot", href: "/chatbot", icon: Bot },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="h-20"></div> {/* Spacer for fixed navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div
          className={`max-w-6xl mx-auto rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 shadow-lg transition-all duration-300 ${
            scrolled ? "shadow-xl bg-opacity-95 backdrop-blur-sm" : "shadow-md"
          }`}
        >
          <div className="flex justify-between items-center h-14 px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  <span className="text-pink-400">KID</span>vocate
                </span>
              </div>
              <nav className="ml-8 flex space-x-1 md:space-x-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1
                      ${
                        activeLink === item.href
                          ? "bg-white text-teal-600 shadow-md transform scale-105"
                          : "text-white hover:bg-teal-400/50 hover:text-white"
                      }`}
                    onClick={() => setActiveLink(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              {isLoading ? (
                <div className="animate-pulse bg-teal-400 rounded-full h-8 w-20"></div>
              ) : isAuthenticated ? (
                <div className="bg-white rounded-full px-4 py-1.5 shadow-md">
                  <LogoutButton />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/auth/login"
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1.5 px-4 rounded-full transition-all duration-200 shadow-md"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-1.5 px-4 rounded-full transition-all duration-200 shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      <footer className="bg-teal-600 text-white text-center py-4 text-sm">
        <p>© 2025 Kidizen - Learning and growing together</p>
      </footer>
    </div>
  )
}
