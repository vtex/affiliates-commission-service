import {
  ALL_MD_FIELDS,
  HTTP_ERRORS,
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
  SUCCESS,
} from '../utils/constants'

export async function getAffiliateOrders(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const { affiliateId } = ctx.vtex.route.params
  const { page, pageSize } = ctx.query
  const { affiliatesOrders } = ctx.clients
  const { logger } = ctx.vtex
  const fieldsWithUpdateDate = [...ALL_MD_FIELDS, 'updatedIn']
  const whereQuery = `affiliateId = '${affiliateId}'`
  const sortBy = 'orderDate asc'

  if (!page || !pageSize) {
    ctx.status = HTTP_ERRORS.missingParams.status
    ctx.message = HTTP_ERRORS.missingParams.message(`page or pageSize`)

    return
  }

  const searchPage = parseInt(page as string, 10)
  const searchPageSize = parseInt(pageSize as string, 10)

  try {
    const result = await affiliatesOrders.searchRaw(
      { page: searchPage, pageSize: searchPageSize },
      fieldsWithUpdateDate,
      sortBy,
      whereQuery
    )

    ctx.status = SUCCESS
    ctx.body = result
  } catch (err) {
    ctx.status = HTTP_ERRORS.serverError.status
    ctx.message = HTTP_ERRORS.serverError.message
    logger.error({
      metric: LOGGER_ERROR_METRICS.getAffiliateOrders,
      message: LOGGER_ERROR_MESSAGES.getAffiliateOrders,
      affiliateId,
      error: err,
    })
  }

  await next()
}
