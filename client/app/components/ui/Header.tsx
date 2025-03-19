"use client"

import { Link, useLocation } from "@remix-run/react"
import { Button } from "./Button"
import { logout } from "../../lib/utils/auth"
import { useState } from "react"
import { Menu, X, Home, DollarSign, CreditCard, LogOut, ChevronRight, PieChart, Wallet, ArrowLeftRight } from "lucide-react"

const navigationLinks = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
    activeClass: "bg-blue-50 text-blue-700",
  },
  {
    path: "/incomes",
    label: "Incomes",
    icon: DollarSign,
    activeClass: "bg-green-50 text-green-700",
  },
  {
    path: "/expenses",
    label: "Expenses",
    icon: CreditCard,
    activeClass: "bg-blue-50 text-blue-700",
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    activeClass: "bg-purple-50 text-purple-700",
  },
  {
    path: "/accounts",
    label: "Accounts",
    icon: Wallet,
    activeClass: "bg-yellow-50 text-yellow-700",
  },
  {
    path: "/insights",
    label: "Insights",
    icon: PieChart,
    activeClass: "bg-purple-50 text-purple-700",
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Budget</h1>
            </Link>

            <nav className="hidden md:flex ml-10 space-x-1">
              {navigationLinks.map(({ path, label, icon: Icon, activeClass }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)
                    ? activeClass
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <X className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map(({ path, label, icon: Icon, activeClass }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${isActive(path)
                  ? activeClass
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
            <div className="pt-2 px-3">
              <Button variant="outline" onClick={handleLogout} className="w-full justify-center gap-2 border-gray-300">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
