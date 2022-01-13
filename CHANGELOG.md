# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.0] - 2022-01-13

### Added

- Endpoint to be used by external sources to get the affiliates orders

## [0.9.1] - 2022-01-13

### Changed

- Bumps follow-redirects from 1.14.6 to 1.14.7

## [0.9.0] - 2022-01-13

### Added

- Auth client

## [0.8.0] - 2022-01-12

### Changed

- Get the variable sku commission in the validateChangedItems middleware

## [0.7.0] - 2022-01-12

### Changed

- Get the variable sku commission in the parseData middleware
- Update order types

## [0.6.0] - 2022-01-12

## Added

- CommissionBySKU service route

## [0.5.0] - 2022-01-10

### Added

- New order typings
- New constants
- Event handler for the invoiced order from orderBroadcast

## [0.4.1] - 2022-01-07

### Changed

- Required attrs to the affiliatesOrders MD entity
- Update the updateOrderStatus middleware to consider the new required attrs

## [0.4.0] - 2022-01-06

### Added

- CommissionBySKU MD entity and client
- CommissionBySKUService

## [0.3.0] - 2022-01-04

### Added

- updateOrderStatus event handler

### Changed

- Change setAffiliatesOrders event topic to order-created

## [0.2.0] - 2022-01-03

### Added

- Checkout client
- Order payment approved event handler

## [0.1.0] - 2021-12-28

### Added

- AffiliatesOrders MD entity and client
