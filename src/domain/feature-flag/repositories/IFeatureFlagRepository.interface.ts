import { FeatureFlag } from '../entities/FeatureFlag.entity';
import { ServiceName } from '../value-objects/ServiceName.vo';

export interface IFeatureFlagRepository {
  findByServiceName(serviceName: ServiceName): Promise<FeatureFlag | null>;
  save(featureFlag: FeatureFlag): Promise<void>;
}
