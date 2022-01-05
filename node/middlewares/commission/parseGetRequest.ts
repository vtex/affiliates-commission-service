import type { CommissionServiceInputData } from '../../typings/commission'

export async function parseGetRequest(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    query: { ids },
    vtex: { logger },
    state,
  } = ctx

  const parsedData: unknown[] = []

  try {
    typeof ids === 'string' &&
      ids.split(',').forEach((id) => {
        parsedData.push({ id })
      })

    state.commissionInput = parsedData as CommissionServiceInputData
  } catch (err) {
    logger.error({
      metric: 'parse-get-commission-request',
      message: err.message,
    })
    throw new Error('Error reading query parameters')
  }

  await next()
}
