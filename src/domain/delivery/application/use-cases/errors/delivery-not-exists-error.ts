export class DeliveryNotExistsError extends Error {
  constructor(identifier: string) {
    super(`Delivery with id "${identifier}" does not exists.`)
  }
}
