import { ValueObject } from '../../shared/value-objects/ValueObject';

export class MaintenanceStatus extends ValueObject {
  private constructor(private readonly value: boolean) {
    super();
  }

  static create(value: boolean): MaintenanceStatus {
    return new MaintenanceStatus(value);
  }

  static active(): MaintenanceStatus {
    return new MaintenanceStatus(true);
  }

  static inactive(): MaintenanceStatus {
    return new MaintenanceStatus(false);
  }

  getValue(): boolean {
    return this.value;
  }

  isActive(): boolean {
    return this.value === true;
  }

  protected equals(other: MaintenanceStatus): boolean {
    return this.value === other.value;
  }
}
