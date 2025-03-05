export class UserAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`User with document "${identifier}" already exists`)
  }
}
