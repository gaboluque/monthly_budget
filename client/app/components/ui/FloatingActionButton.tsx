import { Link } from "@remix-run/react";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
    to: string;
    ariaLabel?: string;
}

export function FloatingActionButton({
    to,
    ariaLabel = "Create new item",
}: FloatingActionButtonProps) {
    return (
        <Link
            to={to}
            aria-label={ariaLabel}
            className="fixed bottom-20 md:bottom-6 right-6 z-15 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
            <Plus className="w-6 h-6" />
        </Link>
    );
} 