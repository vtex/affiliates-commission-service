import {
  fieldResolvers as affiliateOrdersFieldResolvers,
  queries as affiliateOrdersQueries,
  mutations as affiliateOrdersMutations,
} from './affiliateOrders'
import {
  fieldResolvers as commissionsBySKUFieldResolvers,
  queries as CommissionsBySKUQueries,
  mutations as CommissionsBySKUMutations,
} from './commissionsBySKU'

export const resolvers = {
  ...affiliateOrdersFieldResolvers,
  ...commissionsBySKUFieldResolvers,
  Query: {
    ...affiliateOrdersQueries,
    ...CommissionsBySKUQueries,
  },
  Mutation: {
    ...affiliateOrdersMutations,
    ...CommissionsBySKUMutations,
  },
}
