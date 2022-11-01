import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'
import { HTTP_ERRORS } from '../../utils/constants'

export async function setCommissionEventHandler(
  ctx: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    body: {
      data: { id, commission, refId },
      senderAppId,
    },
    clients: { commissionBySKU, catalog },
  } = ctx

  if (senderAppId !== 'vtex.affiliates-commission-service') return

  try {
    await catalog.getSkuById(id)
    await commissionBySKU.saveOrUpdate({
      id: String(id),
      commission,
      refId: refId && String(refId),
    })
  } catch (error) {
    if (error?.response?.status === HTTP_ERRORS.notFound.status) return
    if (error?.response?.status !== HTTP_ERRORS.noChanges.status) throw error
  }

  await next()
}
