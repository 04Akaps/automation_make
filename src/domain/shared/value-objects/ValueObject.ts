export abstract class ValueObject {
  protected abstract equals(other: ValueObject): boolean;

  public equalsTo(other: ValueObject): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.constructor.name !== this.constructor.name) {
      return false;
    }

    return this.equals(other);
  }
}
