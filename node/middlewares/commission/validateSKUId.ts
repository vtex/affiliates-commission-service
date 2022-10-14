import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'
import { HTTP_ERRORS } from '../../utils/constants'

export async function validateSKUId(
  ctx: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    body: {
      data: { id },
    },
    clients: { catalog, logSKUErrors },
  } = ctx

  try {
    await catalog.getSkuById(id)
    await logSKUErrors.save({
      id,
      success: true,
      notFound: false,
    })
  } catch (error) {
    if (error?.response?.status === HTTP_ERRORS.notFound.status) {
      await logSKUErrors.save({
        id,
        success: false,
        notFound: true,
      })

      return
    }

    throw error
  }

  await next()
}
