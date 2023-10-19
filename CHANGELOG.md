# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Master Data client deletion

## [2.2.1] - 2022-11-03

### Fixed

- SKU Not Found validation added


## [2.2.0] - 2022-10-13

### Fixed

- Order client reversed to checkout

## [2.1.3] - 2022-10-13
### Fixed

- Order Discount value being used
- Comission Percentual is now being divided by 100

## [2.1.2] - 2022-10-06
### Added

- Order Date to the export sheet

## [2.1.1] - 2022-10-03

### Fixed

- Commission Percentual sheet column name changed
- Discount value validation
## [2.1.0] - 2022-09-22

### Added

- affiliate name and email to export orders table

## [2.0.4] - 2022-09-19

### Added

- Format `date-time` to orderDate on affiliatesOrders schema

## [2.0.3] - 2022-08-29

### Fixed

- Formatting commission and price values to be exported

## [2.0.2] - 2022-08-11

### Added

- status to spreadsheet of Orders

## [2.0.1] - 2022-08-09

### Changed

- Checkout orders client to masterdata orders

## [2.0.0] - 2022-08-08

### Changed

- Status input type on affiliateOrders is now an enum

## [1.0.0] - 2022-07-26

### Added

- Verification to `ongoing` and `cancel` status on `affiliatesOrders` filter

## [0.23.1] - 2022-07-13

### Fixed

- `affiliates-commission-service` typings version on `package.json`

## [0.23.0] - 2022-07-07

## [0.22.1] - 2022-06-23

### Fixed

- VTEX Setup -i environment adjustments

## [0.22.0] - 2022-06-21

### Added

- Added a new layer of data that will return specific order values based on three different status `cancelled`, `invoiced` and `payment-approved`

## [0.21.1] - 2022-06-01

## Fixed

- Fix refId not being saved on setCommissionEventHandler

## [0.21.0] - 2022-05-31

### Fixed

- Add payment-pending topic to order status change event handler

## [0.20.6] - 2022-04-29

### Changed

- Update export method to use the MD scroll function

## [0.20.5] - 2022-04-22

### Chore

- Update dependencies

## [0.20.4] - 2022-04-22

## [0.20.3] - 2022-03-25

## [0.20.2] - 2022-03-25

### Changed

- Remove userEmail from the return of affiliateOrders for an external source

## [0.20.1] - 2022-03-23

### Changed

- Fix vbase response status code variable name

## [0.20.0] - 2022-03-16

## [0.19.1] - 2022-03-16

### Changed

- Fix the file import logic for the first file upload

## [0.19.0] - 2022-03-10

### Added

- New totalizers field to the affiliateOrders query

## [0.18.0] - 2022-03-08

### Added

- Get last imported commission file service route

### Updated

- Commission importing now saves file to VBase

## [0.17.0] - 2022-03-03

### Updated

- Commission importing now validates file columns before notifying broadcaster

## [0.16.0] - 2022-02-24

### Added

- Masterdata aggregations client
- Endpoint to consult affiliate orders aggregations

## [0.15.1] - 2022-02-11

### Fixed

- Sender validation for commissions importing event handler

## [0.15.0] - 2022-02-11

###

- GraphQL mutation and resolver for importing commissions by SKU sheet

## [0.14.0] - 2022-02-04

### Added

- GraphQL mutation and resolver for exporting affiliate orders sheet
- GraphQL mutation and resolver for exporting commisions by SKU sheet
- Exporting service for both masterdata entities

## [0.13.0] - 2022-02-02

### Added

- updateCommission mutation

## [0.12.0] - 2022-01-24

### Added

- GraphQL Schema, typings and resolvers for Affiliate Orders and Commissions By SKU

## [0.11.0] - 2022-01-20

### Added

- Function to get default commission from affiliates app settings

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
