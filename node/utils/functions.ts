import type { Clients } from '../clients'
import { MAIN_APP_ID } from './constants'

export const getDefaultCommission = async (client: Clients) => {
  const app = await client.apps.getApp(MAIN_APP_ID)
  const settings = await client.apps.getAppSettings(app.id)

  return settings.defaultSkuCommissionValue
}
