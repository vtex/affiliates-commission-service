import { queries as affiliateOrdersQueries } from './affiliateOrders'

export const resolvers = {
  Query: {
    ...affiliateOrdersQueries,
  },
}
