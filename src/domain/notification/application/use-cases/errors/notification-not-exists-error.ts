export class NotificationNotExistsError extends Error {
  constructor(identifier: string) {
    super(`Notification with id "${identifier}" does not exists.`)
  }
}
