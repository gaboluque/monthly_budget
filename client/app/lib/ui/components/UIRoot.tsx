import { useState, useEffect } from "react"
import { Confirm } from "../../../components/Confirm"
import { Notification } from "../../../components/Notification"
import { UIManager } from "../manager"
import type { ConfirmOptions, NotificationItem } from "../types"

export function UIRoot() {
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; options: ConfirmOptions | null }>({
    isOpen: false,
    options: null
  })
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const confirmUnsubscribe = UIManager.getInstance()
      .getConfirmationsManager()
      .subscribe(setConfirmState)

    const notifyUnsubscribe = UIManager.getInstance()
      .getNotificationsManager()
      .subscribe(setNotifications)

    return () => {
      confirmUnsubscribe()
      notifyUnsubscribe()
    }
  }, [])

  const handleConfirm = () => {
    confirmState.options?.onConfirm?.()
    UIManager.getInstance().getConfirmationsManager().close()
  }

  const handleCancel = () => {
    confirmState.options?.onCancel?.()
    UIManager.getInstance().getConfirmationsManager().close()
  }

  const handleNotificationClose = (id: string) => {
    UIManager.getInstance().getNotificationsManager().close(id)
  }

  return (
    <>
      {confirmState.options && (
        <div className="relative z-40">
          <Confirm
            isOpen={confirmState.isOpen}
            onClose={handleCancel}
            onConfirm={handleConfirm}
            title={confirmState.options.title}
            message={confirmState.options.message}
            confirmText={confirmState.options.confirmText}
            cancelText={confirmState.options.cancelText}
            confirmVariant={confirmState.options.confirmVariant}
          />
        </div>
      )}
      <div className="relative z-50">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            isVisible={true}
            message={notification.message}
            type={notification.type}
            onClose={() => handleNotificationClose(notification.id)}
          />
        ))}
      </div>
    </>
  )
} 