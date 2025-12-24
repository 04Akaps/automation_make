import { FeatureFlag } from '../../../../domain/feature-flag/entities/FeatureFlag.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { ServiceName } from '../../../../domain/feature-flag/value-objects/ServiceName.vo';
import { MaintenanceStatus } from '../../../../domain/feature-flag/value-objects/MaintenanceStatus.vo';
import { FeatureFlagRow } from '../types/FeatureFlagRow';

export class FeatureFlagPersistenceMapper {
  static toDomain(row: FeatureFlagRow): FeatureFlag {
    return FeatureFlag.create(
      UniqueId.create(row.id),
      ServiceName.create(row.service_name),
      MaintenanceStatus.create(row.is_maintenance === 1)
    );
  }

  static toPersistence(featureFlag: FeatureFlag): Omit<FeatureFlagRow, 'created_at' | 'updated_at'> {
    const idValue = featureFlag.id.getValue();
    return {
      id: typeof idValue === 'number' ? idValue : parseInt(idValue, 10),
      service_name: featureFlag.serviceName.getValue(),
      is_maintenance: featureFlag.maintenanceStatus.getValue() ? 1 : 0,
    };
  }
}
