import { IOClients } from '@vtex/api'
import { masterDataFor, Catalog } from '@vtex/clients'
import type {
  AffiliatesOrders,
  CommissionBySKU,
} from 'vtex.affiliates-commission-service'

import AuthenticationClient from './authenticationClient'
import CheckoutExtended from './checkout'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get affiliatesOrders() {
    return this.getOrSet(
      'affiliatesOrders',
      masterDataFor<AffiliatesOrders>('affiliatesOrders')
    )
  }

  public get commissionBySKU() {
    return this.getOrSet(
      'commissionBySKU',
      masterDataFor<CommissionBySKU>('commissionBySKU')
    )
  }

  public get checkout() {
    return this.getOrSet('checkout', CheckoutExtended)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get authentication() {
    return this.getOrSet('authentication', AuthenticationClient)
  }
}
