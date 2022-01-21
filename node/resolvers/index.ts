import {
  fieldResolvers as affiliateOrdersFieldResolvers,
  queries as affiliateOrdersQueries,
} from './affiliateOrders'

export const resolvers = {
  ...affiliateOrdersFieldResolvers,
  Query: {
    ...affiliateOrdersQueries,
  },
}
