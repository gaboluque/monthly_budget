"use client"

import { Link, useLocation } from "@remix-run/react"
import { Button } from "./Button"
import { logout } from "../lib/utils/auth"
import { useState } from "react"
import { Menu, X, Home, DollarSign, CreditCard, LogOut, ChevronRight, PieChart } from "lucide-react"

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
              <Link
                to="/dashboard"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/incomes"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/incomes")
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Incomes
              </Link>
              <Link
                to="/expenses"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/expenses")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Expenses
              </Link>
              <Link
                to="/insights"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/insights")
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Insights
              </Link>
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
            <Link
              to="/dashboard"
              className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                isActive("/dashboard")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/incomes"
              className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                isActive("/incomes")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-3" />
                Incomes
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/expenses"
              className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                isActive("/expenses")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3" />
                Expenses
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/insights"
              className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                isActive("/insights")
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <PieChart className="w-5 h-5 mr-3" />
                Insights
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
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
