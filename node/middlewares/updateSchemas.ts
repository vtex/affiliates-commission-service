import { UpdateSchemasService } from '../services/updateSchemasService'

export async function updateStore(ctx: Context, next: () => Promise<unknown>) {
  const updateSchemaService = new UpdateSchemasService(ctx)

  try {
    await updateSchemaService.updateAffiliates()
    ctx.status = 200
    ctx.message = 'Schemas updated sucessfully'
  } catch (err) {
    ctx.vtex.logger.error({
      metric: 'update-store-schemas',
      message: err.message,
    })
    ctx.status = 500
    ctx.message = 'Error updating store schemas'
  }

  await next()
}
