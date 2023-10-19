import type { InstanceOptions, IOContext } from '@vtex/api'
import { parseAppId, JanusClient } from '@vtex/api'

import type { AggregateResponse } from '../../typings/masterDataAggregations'
import { MasterDataAggregations } from './masterDataAggregationsClient'

export abstract class MasterDataEntity extends JanusClient {
  abstract schema: string
  abstract dataEntity: string
  abstract aggregateValue(
    field: string,
    where: string
  ): Promise<AggregateResponse>
}

/**
 * This is necessary since masterdata does not accept special characters on entity name
 * This function replaces `.` and `-` for `_`
 * @param str dataEntityName
 */
const normalizeEntityName = (str: string) => str.replace(/(\.)|-|:/gi, '_')

export const masterDataAggregateFor = (
  entityName: string,
  schemaVersion: string
): new (context: IOContext, options?: InstanceOptions) => MasterDataEntity => {
  return class extends MasterDataEntity {
    public dataEntity: string
    public schema: string
    private inner: MasterDataAggregations
    constructor(ctx: IOContext, options?: InstanceOptions) {
      super(ctx, options)
      const app = parseAppId(process.env.VTEX_APP_ID as string)

      this.inner = new MasterDataAggregations(ctx, options)
      this.schema = `${schemaVersion}`
      this.dataEntity = normalizeEntityName(`${app.name}_${entityName}`)
    }

    public aggregateValue(field: string, where: string) {
      return this.inner.aggregateValue({
        dataEntity: this.dataEntity,
        field,
        schema: this.schema,
        where,
      })
    }
  }
}
