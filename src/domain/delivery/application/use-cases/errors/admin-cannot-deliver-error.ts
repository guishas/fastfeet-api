export class AdminCannotDeliverError extends Error {
  constructor() {
    super('Only deliverers can deliver a delivery.')
  }
}
