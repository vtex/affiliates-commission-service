import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'
import { emailTemplateData } from '../../utils/email'
import type { MDEntityForExporting } from '../../utils/exporting'

export async function createEmailTemplates(
  { clients: { messageCenter } }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const entities: MDEntityForExporting[] = [
    'affiliatesOrders',
    'commissionBySKU',
  ]

  entities.forEach(async (entity) => {
    const templateData = emailTemplateData(entity)

    await messageCenter.createTemplate(templateData)
  })

  await next()
}
