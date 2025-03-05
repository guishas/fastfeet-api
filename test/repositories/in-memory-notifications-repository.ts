import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(notificationId: string) {
    const notification = this.items.find((item) =>
      item.id.stringEquals(notificationId),
    )

    if (!notification) {
      return null
    }

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(notification.id),
    )

    this.items[itemIndex] = notification
  }
}
