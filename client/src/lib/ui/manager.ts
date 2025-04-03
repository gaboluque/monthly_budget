import { ConfirmOptions, NotifyOptions } from "./types";
import { NotificationsManager } from "./notifications";
import { ConfirmationsManager } from "./confirmations";

export class UIManager {
  private static instance: UIManager;
  private notifications: NotificationsManager;
  private confirmations: ConfirmationsManager;

  private constructor() {
    this.notifications = new NotificationsManager();
    this.confirmations = new ConfirmationsManager();
  }

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }
    return UIManager.instance;
  }

  public getNotificationsManager(): NotificationsManager {
    return this.notifications;
  }

  public getConfirmationsManager(): ConfirmationsManager {
    return this.confirmations;
  }
}

// Export a simple interface for common UI operations
export const ui = {
  confirm: (options: ConfirmOptions) =>
    UIManager.getInstance().getConfirmationsManager().show(options),
  notify: (options: NotifyOptions) =>
    UIManager.getInstance().getNotificationsManager().show(options),
};
