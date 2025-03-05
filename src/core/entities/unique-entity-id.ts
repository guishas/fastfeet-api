import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(other: UniqueEntityID) {
    return other.toValue() === this.value
  }

  stringEquals(other: string) {
    return this.value === other
  }
}
