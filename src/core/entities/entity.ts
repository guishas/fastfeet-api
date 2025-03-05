import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID(id)
  }

  public equals(other: Entity<unknown>) {
    if (other === this) {
      return true
    }

    if (other.id.equals(this.id)) {
      return true
    }

    return false
  }
}
