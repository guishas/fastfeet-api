export class AttachmentNotExistsError extends Error {
  constructor(identifier: string) {
    super(`Attachment with id "${identifier}" does not exists.`)
  }
}
