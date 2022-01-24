import {
  fieldResolvers as affiliateOrdersFieldResolvers,
  queries as affiliateOrdersQueries,
} from './affiliateOrders'
import {
  fieldResolvers as commissionsBySKUFieldResolvers,
  queries as CommissionsBySKUQueries,
} from './commissionsBySKU'

export const resolvers = {
  ...affiliateOrdersFieldResolvers,
  ...commissionsBySKUFieldResolvers,
  Query: {
    ...affiliateOrdersQueries,
    ...CommissionsBySKUQueries,
  },
}
