export class UserNotExistsError extends Error {
  constructor(identifier: string) {
    super(`User with id "${identifier}" does not exists.`)
  }
}
