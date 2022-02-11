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

  await commissionBySKU.saveOrUpdate({ id: String(id), commission })

  await next()
}
