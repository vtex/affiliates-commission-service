import type { AffiliateOrdersFilterInput } from 'vtex.affiliates-commission-service'

import {
  HTTP_ERRORS,
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
  SUCCESS,
} from '../utils/constants'
import { parseAffiliateOrdersFilters } from '../utils/filters'

export async function getAffiliateOrdersAggregate(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const { affiliateId } = ctx.vtex.route.params
  const { field, startDate, endDate, status } = ctx.query
  const { affiliatesOrdersAggregate } = ctx.clients
  const { logger } = ctx.vtex
  const parseObject = {
    affiliateId,
    status,
    dateRange: { startDate, endDate },
  } as AffiliateOrdersFilterInput

  if (!field || !startDate || !endDate) {
    ctx.status = HTTP_ERRORS.missingParams.status
    ctx.message = HTTP_ERRORS.missingParams.message(
      `fields or startDate or endDate`
    )

    return
  }

  const whereQuery = parseAffiliateOrdersFilters(parseObject)

  try {
    const result = await affiliatesOrdersAggregate.aggregateValue(
      field as string,
      whereQuery
    )

    ctx.status = SUCCESS
    ctx.body = result
  } catch (err) {
    ctx.status = HTTP_ERRORS.serverError.status
    ctx.message = HTTP_ERRORS.serverError.message
    logger.error({
      metric: LOGGER_ERROR_METRICS.getAffiliateOrdersAggregate,
      message: LOGGER_ERROR_MESSAGES.getAffiliateOrdersAggregate,
      affiliateId,
      error: err,
    })
  }

  await next()
}
