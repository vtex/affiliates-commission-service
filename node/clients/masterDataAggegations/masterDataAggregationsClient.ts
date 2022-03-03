import type {
  InstanceOptions,
  IOContext,
  RequestTracingConfig,
} from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type {
  AggregateResponse,
  AggregateValueInput,
} from '../../typings/masterDataAggregations'

const routes = {
  aggregate: (dataEntity: string) => `${dataEntity}/aggregations`,
}

export class MasterDataAggregations extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/api/dataentities`, ctx, {
      ...options,
      headers: {
        Accept: 'application/json',
        VtexIdclientAutCookie: ctx.authToken,
        'x-vtex-api-appService': ctx.userAgent,
        ...options?.headers,
      },
      params: {
        an: ctx.account,
        ...options?.params,
      },
    })
  }

  public aggregateValue(
    { dataEntity, field, schema, where }: AggregateValueInput,
    tracingConfig?: RequestTracingConfig
  ) {
    const metric = 'masterdata-aggregations'

    return this.http.get<AggregateResponse>(routes.aggregate(dataEntity), {
      metric,
      params: {
        _field: field,
        _schema: schema,
        _where: where,
        _type: 'sum',
      },
      tracing: {
        requestSpanNameSuffix: metric,
        ...tracingConfig?.tracing,
      },
    })
  }
}
