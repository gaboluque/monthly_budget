import { Link, useLocation } from "@remix-run/react"
import { Button } from "./Button"
import { logout } from "../../lib/utils/auth"
import { LogOut } from "lucide-react"
import { navigationLinks } from "./routes"

export function Header() {
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

          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
