import {
  COMMISSIONS_ENTITY,
  AFFILIATES_ORDERS_ENTITY,
  AFFILIATES_COMMISSION_SERVICE_VERSIONS,
} from '../utils/constants'

interface SchemaData {
  entity: string
  version: string
}

export class UpdateSchemasService {
  private ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
  }

  private getAccountSchemas = async (entity: string) => {
    const {
      clients: { schemas },
    } = this.ctx

    try {
      return schemas.getSchemas(entity)
    } catch (err) {
      return this.ctx.vtex.logger.error({
        metric: 'get-account-schemas',
        message: err.message,
      })
    }
  }

  private deleteSchema = async (data: SchemaData) => {
    const {
      clients: { schemas },
    } = this.ctx

    try {
      return schemas.deleteSchema(data)
    } catch (err) {
      return this.ctx.vtex.logger.error({
        metric: 'delete-schema',
        message: err.message,
      })
    }
  }

  private createSchema = async (data: SchemaData, schema: any) => {
    const {
      clients: { schemas },
    } = this.ctx

    try {
      return schemas.createSchema(data, schema)
    } catch (err) {
      return this.ctx.vtex.logger.error({
        metric: 'create-schema',
        message: err.message,
      })
    }
  }

  private getEntitySchema = async (data: SchemaData) => {
    const {
      clients: { schemas },
    } = this.ctx

    try {
      return schemas.getCurrentSchema(data)
    } catch (err) {
      return this.ctx.vtex.logger.error({
        metric: 'get-entity-schema',
        message: err.message,
      })
    }
  }

  private schemasToDelete = async (entity: string) => {
    try {
      const schemas: Array<{ name: string }> = await this.getAccountSchemas(
        entity
      )

      const schemasToDelete = schemas.filter((schema) => {
        const hasAffiliateVersion = AFFILIATES_COMMISSION_SERVICE_VERSIONS.map(
          (version) => {
            return !schema.name.includes(version)
          }
        ).reduce((acc, curr) => acc && curr, true)

        return hasAffiliateVersion
      })

      console.info('schemasToDelete', schemasToDelete)

      return schemasToDelete
    } catch (err) {
      this.ctx.vtex.logger.error({
        metric: 'schemas-to-delete',
        message: err.message,
      })
      throw new Error('Error getting schemas to delete')
    }
  }

  private deleteSchemas = async (entity: string) => {
    try {
      const schemasToDelete = await this.schemasToDelete(entity)

      const deletePromises = schemasToDelete?.map((schema) => {
        return this.deleteSchema({
          entity,
          version: schema.name,
        })
      })

      await Promise.all(deletePromises ?? [])
    } catch (err) {
      this.ctx.vtex.logger.error({
        metric: 'delete-schemas',
        message: err.message,
      })
    }
  }

  public updateSchemas = async (entity: string, version: string) => {
    try {
      await this.deleteSchemas(entity)

      const schema = await this.getEntitySchema({
        entity,
        version,
      })

      if (Object.keys(schema).length !== 0) {
        await this.createSchema(
          {
            entity,
            version,
          },
          {}
        )
        await this.createSchema(
          {
            entity,
            version,
          },
          schema
        )
      }
    } catch (err) {
      this.ctx.vtex.logger.error({
        metric: 'update-schemas',
        message: err.message,
      })
    }
  }

  public updateAffiliates = async () => {
    await this.updateSchemas(
      COMMISSIONS_ENTITY,
      process.env.VTEX_APP_VERSION ?? ''
    )
    await this.updateSchemas(
      AFFILIATES_ORDERS_ENTITY,
      process.env.VTEX_APP_VERSION ?? ''
    )
  }
}
