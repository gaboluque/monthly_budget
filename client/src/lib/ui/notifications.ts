import { NotifyOptions, NotificationItem } from "./types";

export class NotificationsManager {
  private notifications: NotificationItem[] = [];
  private counter: number = 0;
  private subscribers = new Set<(notifications: NotificationItem[]) => void>();

  public subscribe(callback: (notifications: NotificationItem[]) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.notifications));
  }

  public show(options: NotifyOptions): string {
    const id = `notification-${++this.counter}`;
    this.notifications = [...this.notifications, { ...options, id }];
    this.notifySubscribers();

    if (options.type === "error") {
      console.error(options.message, options.error);
    }

    return id;
  }

  public close(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifySubscribers();
  }

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }
}
