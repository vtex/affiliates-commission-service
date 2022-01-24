import {
  fieldResolvers as affiliateOrdersFieldResolvers,
  queries as affiliateOrdersQueries,
} from './affiliateOrders'
import { queries as CommissionsBySKUQueries } from './commissionsBySKU'

export const resolvers = {
  ...affiliateOrdersFieldResolvers,
  Query: {
    ...affiliateOrdersQueries,
    ...CommissionsBySKUQueries,
  },
}
