export const CUSTOM_DATA_APP_ID = 'affiliates'
export const CUSTOM_DATA_FIELD_ID = 'affiliateId'
export const SUCCESS = 200

export const SHAREABLE_MD_FIELDS = [
  'id',
  'affiliateId',
  'status',
  'orderDate',
  'orderItems',
  'orderTotalCommission',
  'orderTotal',
]

export const ALL_MD_FIELDS = [...SHAREABLE_MD_FIELDS, 'userEmail']

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
  getAffiliateOrdersAggregate: 'get-affiliate-orders-aggregate',
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
  getAffiliateOrdersAggregate: 'Error getting the affiliate order aggregate',
}

export const APP_KEY_HEADER = 'x-vtex-api-appkey'
export const APP_TOKEN_HEADER = 'x-vtex-api-apptoken'

export const HTTP_ERRORS = {
  noChanges: {
    status: 304,
    message: 'No changes',
  },
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
  notFound: {
    status: 404,
    message: 'Not found',
  },
}

export const MD_READ_PERMISSION = 'READONLY_USER_DS'
export const MAIN_APP_ID = 'vtex.affiliates'

export const AFFILIATES_COMMISSION_SERVICE_VERSIONS = [
  process.env.VTEX_APP_VERSION ?? '',
  '2.2.1',
  '2.2.0',
  '2.1.2',
]

export const COMMISSIONS_ENTITY =
  'vtex_affiliates_commission_service_commissionBySKU'
export const AFFILIATES_ORDERS_ENTITY =
  'vtex_affiliates_commission_service_affiliatesOrders'
