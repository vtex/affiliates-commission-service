import type { Apps } from '@vtex/api'

import { MAIN_APP_ID } from './constants'

export const getDefaultCommission = async (apps: Apps) => {
  const app = await apps.getApp(MAIN_APP_ID)
  const settings = await apps.getAppSettings(app.id)

  return settings.defaultSkuCommissionValue
}
