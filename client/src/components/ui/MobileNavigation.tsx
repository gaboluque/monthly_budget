import { Link, useLocation } from "react-router";
import { routes } from "../../routes/_index";
export function MobileNavigation() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/account') {
            return location.pathname === '/account' || location.pathname.startsWith('/account/');
        }
        return location.pathname === path;
    };

    return (
        <div className="sticky-footer md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 z-20">
            <div className="flex justify-center gap-6 items-center h-16 w-full">
                {Object.values(routes).slice(0, 5).map(({ path, label, icon: Icon, color, nav }) => (
                    nav && Icon && <Link
                        key={path}
                        to={path}
                        className={`flex flex-col items-center justify-center text-xs font-medium ${isActive(path)
                            ? `text-${color}-700`
                            : "text-gray-600"
                            }`}
                    >
                        <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? `text-${color}-700` : "text-gray-500"}`} />
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
} 