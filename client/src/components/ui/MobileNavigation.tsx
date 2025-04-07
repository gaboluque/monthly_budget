import { Link, useLocation } from "react-router-dom";
import { navigationLinks } from "./routes";

export function MobileNavigation() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="md:hidden fixed bottom-10 left-0 right-0 bg-white border-t border-gray-200 z-20">
            <div className="grid grid-cols-5 h-16">
                {navigationLinks.slice(0, 5).map(({ path, label, icon: Icon, activeClass }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex flex-col items-center justify-center text-xs font-medium ${isActive(path)
                            ? activeClass
                            : "text-gray-600"
                            }`}
                    >
                        <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? "" : "text-gray-500"}`} />
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
} 