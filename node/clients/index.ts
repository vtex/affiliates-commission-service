import { IOClients } from '@vtex/api'
import { masterDataFor, Catalog } from '@vtex/clients'
import type {
  AffiliatesOrders,
  CommissionBySKU,
} from 'vtex.affiliates-commission-service'

import AuthenticationClient from './authenticationClient'
import MDOrders from './orders'
import { masterDataAggregateFor } from './masterDataAggegations/masterDataAggregationsFactory'
import MessageCenterClient from './messageCenter'
import { SpreadsheetEventBroadcasterClient } from './spreadsheetEventBroadcaster'

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

  public get affiliatesOrdersAggregate() {
    return this.getOrSet(
      'affiliatesOrdersAggregate',
      masterDataAggregateFor('affiliatesOrders')
    )
  }

  public get orders() {
    return this.getOrSet('orders', MDOrders)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get authentication() {
    return this.getOrSet('authentication', AuthenticationClient)
  }

  public get messageCenter() {
    return this.getOrSet('messageCenter', MessageCenterClient)
  }

  public get spreadsheetEventBroadcaster() {
    return this.getOrSet(
      'spreadsheetEventBroadcaster',
      SpreadsheetEventBroadcasterClient
    )
  }
}
