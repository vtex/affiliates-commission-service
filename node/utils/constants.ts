export const CUSTOM_DATA_APP_ID = 'affiliates'
export const CUSTOM_DATA_FIELD_ID = 'affiliateId'
export const SUCCESS = 200

export const LOGGER_ERROR_METRICS = {
  updateOrderStatus: 'update-order-status',
  parseGetCommissionRequest: 'parse-get-commission-request',
  getCommissionBySKU: 'get-commission-by-sku',
  setCommissionBySKU: 'set-commission-by-sku',
  deleteCommissionBySKU: 'delete-commission-by-sku',
}

export const LOGGER_ERROR_MESSAGES = {
  updateOrderStatus: 'Error updating the order status',
  parseGetCommissionRequest: 'Error reading query parameters',
  getCommissionBySKU: 'Error getting commission by SKU',
  setCommissionBySKU: 'Error setting commission by SKU',
  deleteCommissionBySKU: 'Error deleting commission by SKU',
}
