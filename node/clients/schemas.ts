import type { InstanceOptions, IOContext, RequestConfig } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const routes = {
  accountSchemas: (entity: string) => `/api/dataentities/${entity}/schemas`,
  schemaVersion: (entity: string, version: string) =>
    `/api/dataentities/${entity}/schemas/${version}`,
  documents: (entity: string) => `/api/dataentities/${entity}/search`,
}

interface SchemaData {
  entity: string
  version: string
}

export default class Schemas extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    console.info('context', context.authToken)
    super('http://api.vtex.com', context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        VtexIdclientAutCookie: context.authToken,
      },
      params: {
        ...options?.params,
        an: context.account,
      },
    })
  }

  public async getSchemas(
    entity: string,
    config?: RequestConfig
  ): Promise<any> {
    return this.http.get(routes.accountSchemas(entity), config)
  }

  public async getCurrentSchema(
    data: SchemaData,
    config?: RequestConfig
  ): Promise<any> {
    try {
      const response = await this.http.get(
        routes.schemaVersion(data.entity, data.version),
        config
      )

      console.info('getCurrentSchema', response)

      return response
    } catch (err) {
      console.info('getCurrentSchema', err.response.status)
      throw new Error(err.message)
    }
  }

  public async deleteSchema(
    data: SchemaData,
    config?: RequestConfig
  ): Promise<any> {
    return this.http.delete(
      routes.schemaVersion(data.entity, data.version),
      config
    )
  }

  public async createSchema(
    data: SchemaData,
    body: any,
    config?: RequestConfig
  ): Promise<string> {
    return this.http.put(
      routes.schemaVersion(data.entity, data.version),
      body,
      config
    )
  }
}
