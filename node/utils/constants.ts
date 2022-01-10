export const CUSTOM_DATA_APP_ID = 'affiliates'
export const CUSTOM_DATA_FIELD_ID = 'affiliateId'

export const ALL_MD_FIELDS = [
  'id',
  'affiliateId',
  'status',
  'userEmail',
  'orderDate',
  'orderItems',
  'orderTotalCommission',
  'orderTotal',
]

export const INVOICED_STATUS = 'invoiced'

export const LOGGER_ERROR_METRICS = {
  updateOrderStatus: 'update-order-status',
  getAffiliateOrder: 'get-affiliate-order',
  validateChangedItems: 'validate-changed-items',
  parseData: 'parse-data',
}

export const LOGGER_ERROR_MESSAGES = {
  updateOrderStatus: 'Error updating the order status',
  getAffiliateOrder: 'Error getting the affiliate order',
  validateChangedItems: 'Error validating the changed items',
  parseData: 'Error parsing the order data',
}
