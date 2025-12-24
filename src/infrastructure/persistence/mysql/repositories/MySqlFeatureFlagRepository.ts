import { inject, injectable } from 'tsyringe';
import { IFeatureFlagRepository } from '../../../../domain/feature-flag/repositories/IFeatureFlagRepository.interface';
import { FeatureFlag } from '../../../../domain/feature-flag/entities/FeatureFlag.entity';
import { ServiceName } from '../../../../domain/feature-flag/value-objects/ServiceName.vo';
import { ManagementDatabaseConnection } from '../connection/ManagementDatabaseConnection';
import { FeatureFlagPersistenceMapper } from '../mappers/FeatureFlagPersistenceMapper';
import { FeatureFlagRow } from '../types/FeatureFlagRow';

@injectable()
export class MySqlFeatureFlagRepository implements IFeatureFlagRepository {
  constructor(
    @inject(ManagementDatabaseConnection)
    private readonly db: ManagementDatabaseConnection
  ) {}

  async findByServiceName(serviceName: ServiceName): Promise<FeatureFlag | null> {
    const sql = 'SELECT * FROM feature_flags WHERE service_name = ? LIMIT 1';
    const rows = await this.db.query<FeatureFlagRow[]>(sql, [serviceName.getValue()]);

    if (rows.length === 0) {
      return null;
    }

    return FeatureFlagPersistenceMapper.toDomain(rows[0]);
  }

  async save(featureFlag: FeatureFlag): Promise<void> {
    const data = FeatureFlagPersistenceMapper.toPersistence(featureFlag);

    const sql = `
      INSERT INTO feature_flags (service_name, is_maintenance)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        is_maintenance = VALUES(is_maintenance)
    `;

    await this.db.execute(sql, [data.service_name, data.is_maintenance]);
  }
}
