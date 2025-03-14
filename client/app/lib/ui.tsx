import { useState, useCallback } from "react"
import { Confirm } from "../components/Confirm"
import type { ButtonVariant } from "../components/Button"

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariant
  onConfirm?: () => void
  onCancel?: () => void
}

type ConfirmState = {
  isOpen: boolean
  options: ConfirmOptions | null
}

// Create a singleton UI manager
class UIManager {
  private static instance: UIManager
  private subscribers: Set<(state: ConfirmState) => void>
  private currentState: ConfirmState

  private constructor() {
    this.subscribers = new Set()
    this.currentState = {
      isOpen: false,
      options: null
    }
  }

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager()
    }
    return UIManager.instance
  }

  public subscribe(callback: (state: ConfirmState) => void) {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.currentState))
  }

  public confirm(options: ConfirmOptions) {
    this.currentState = {
      isOpen: true,
      options: {
        title: options.title || "Confirm",
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        confirmVariant: options.confirmVariant,
        onConfirm: options.onConfirm,
        onCancel: options.onCancel
      }
    }
    this.notify()
  }

  public close() {
    this.currentState = {
      isOpen: false,
      options: null
    }
    this.notify()
  }
}

// Export the singleton instance
export const ui = {
  confirm: (options: ConfirmOptions) => UIManager.getInstance().confirm(options)
}

// Internal component to render the confirmation dialog
export function ConfirmationRoot() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    options: null
  })

  useCallback(() => {
    return UIManager.getInstance().subscribe(setState)
  }, [])()

  const handleConfirm = () => {
    state.options?.onConfirm?.()
    UIManager.getInstance().close()
  }

  const handleCancel = () => {
    state.options?.onCancel?.()
    UIManager.getInstance().close()
  }

  if (!state.options) return null

  return (
    <Confirm
      isOpen={state.isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={state.options.title}
      message={state.options.message}
      confirmText={state.options.confirmText}
      cancelText={state.options.cancelText}
      confirmVariant={state.options.confirmVariant}
    />
  )
} 