import { ConfirmOptions } from "./types";

export class ConfirmationsManager {
  private isOpen: boolean = false;
  private options: ConfirmOptions | null = null;
  private subscribers = new Set<
    (state: { isOpen: boolean; options: ConfirmOptions | null }) => void
  >();

  public subscribe(
    callback: (state: {
      isOpen: boolean;
      options: ConfirmOptions | null;
    }) => void
  ) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) =>
      callback({ isOpen: this.isOpen, options: this.options })
    );
  }

  public show(options: ConfirmOptions) {
    this.isOpen = true;
    this.options = {
      title: options.title || "Confirm",
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      confirmVariant: options.confirmVariant,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    };
    this.notifySubscribers();
  }

  public close() {
    this.isOpen = false;
    this.options = null;
    this.notifySubscribers();
  }

  public getState() {
    return {
      isOpen: this.isOpen,
      options: this.options,
    };
  }
}
