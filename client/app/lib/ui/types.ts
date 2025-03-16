import type { ButtonVariant } from "../../components/ui/Button";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface NotifyOptions {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  error?: unknown;
}

export interface NotificationItem extends NotifyOptions {
  id: string;
}

export interface UIState {
  confirm: {
    isOpen: boolean;
    options: ConfirmOptions | null;
  };
  notifications: NotificationItem[];
}
