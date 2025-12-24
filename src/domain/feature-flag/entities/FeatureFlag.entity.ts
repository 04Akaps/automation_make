import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { ServiceName } from '../value-objects/ServiceName.vo';
import { MaintenanceStatus } from '../value-objects/MaintenanceStatus.vo';

export class FeatureFlag {
  private constructor(
    private readonly _id: UniqueId,
    private readonly _serviceName: ServiceName,
    private _maintenanceStatus: MaintenanceStatus
  ) {}

  static create(
    id: UniqueId,
    serviceName: ServiceName,
    maintenanceStatus: MaintenanceStatus
  ): FeatureFlag {
    return new FeatureFlag(id, serviceName, maintenanceStatus);
  }

  get id(): UniqueId {
    return this._id;
  }

  get serviceName(): ServiceName {
    return this._serviceName;
  }

  get maintenanceStatus(): MaintenanceStatus {
    return this._maintenanceStatus;
  }

  isUnderMaintenance(): boolean {
    return this._maintenanceStatus.isActive();
  }

  enableMaintenance(): void {
    this._maintenanceStatus = MaintenanceStatus.active();
  }

  disableMaintenance(): void {
    this._maintenanceStatus = MaintenanceStatus.inactive();
  }
}
