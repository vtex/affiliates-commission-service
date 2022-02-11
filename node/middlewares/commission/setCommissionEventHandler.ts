import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'

export async function setCommissionEventHandler(
  ctx: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    body: {
      data: { id, commission },
      senderAppId,
    },
    clients: { commissionBySKU },
  } = ctx

  if (senderAppId !== 'vtex.affiliates-commission-service') return

  try {
    await commissionBySKU.saveOrUpdate({ id: String(id), commission })
  } catch (error) {
    if (error?.response?.status !== 304) throw error
  }

  await next()
}
