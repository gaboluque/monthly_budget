import { useEffect } from "react"
import { X } from "lucide-react"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationProps {
  message: string
  type?: NotificationType
  isVisible: boolean
  onClose: () => void
}

const typeStyles: Record<NotificationType, { bg: string; text: string; icon: string }> = {
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    icon: "text-green-500",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-800",
    icon: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-500",
  },
}

export function Notification({
  message,
  type = "info",
  isVisible,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const styles = typeStyles[type]

  return (
    <div
      className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg border shadow-sm-lg transform transition-all duration-300 ease-in-out z-50 ${styles.bg}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-1 ${styles.text}`}>{message}</div>
        <button
          onClick={onClose}
          className={`${styles.icon}`}
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 