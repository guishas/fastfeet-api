import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { NotificationNotExistsError } from './errors/notification-not-exists-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        readAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to read a notification that does not exists', async () => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: 'notification-1',
      recipientId: notification.recipientId.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotificationNotExistsError)
  })

  it('should not be able to read a notification from a different recipient', async () => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: 'user-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
})
