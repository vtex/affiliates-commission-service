export const CUSTOM_DATA_APP_ID = 'affiliates'
export const CUSTOM_DATA_FIELD_ID = 'affiliateId'
export const SUCCESS = 200

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
  parseGetCommissionRequest: 'parse-get-commission-request',
  getCommissionBySKU: 'get-commission-by-sku',
  setCommissionBySKU: 'set-commission-by-sku',
  deleteCommissionBySKU: 'delete-commission-by-sku',
  getAffiliateOrder: 'get-affiliate-order',
  getAffiliateOrders: 'get-affiliate-orders',
  validateChangedItems: 'validate-changed-items',
  parseData: 'parse-data',
}

export const LOGGER_ERROR_MESSAGES = {
  updateOrderStatus: 'Error updating the order status',
  parseGetCommissionRequest: 'Error reading query parameters',
  getCommissionBySKU: 'Error getting commission by SKU',
  setCommissionBySKU: 'Error setting commission by SKU',
  deleteCommissionBySKU: 'Error deleting commission by SKU',
  getAffiliateOrder: 'Error getting the affiliate order',
  getAffiliateOrders: 'Error getting the affiliate orders',
  validateChangedItems: 'Error validating the changed items',
  parseData: 'Error parsing the order data',
}

export const APP_KEY_HEADER = 'x-vtex-api-appkey'
export const APP_TOKEN_HEADER = 'x-vtex-api-apptoken'

export const HTTP_ERRORS = {
  missingAuthentication: {
    status: 401,
    message: 'Missing appKey or appToken',
  },
  forbidden: {
    status: 403,
    message: 'Forbidden',
  },
  serverError: {
    status: 500,
    message: 'Error processing the request',
  },
  missingParams: {
    status: 400,
    message: (params: string) => `Missing params: ${params}`,
  },
}

export const MD_READ_PERMISSION = 'READONLY_USER_DS'
