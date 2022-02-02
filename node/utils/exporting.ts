export type MDEntityForExporting = 'affiliatesOrders' | 'commissionBySKU'

export const bucketNameForExporting = (type: MDEntityForExporting) =>
  type === 'affiliatesOrders' ? 'orders' : 'commissions'

export const fieldsForExporting = (type: MDEntityForExporting) =>
  type === 'affiliatesOrders'
    ? ['id', 'affiliateId', 'orderTotalCommission', 'orderItems']
    : ['id', 'commission']

export const PAGE_SIZE_FOR_EXPORTING = 500

export const baseURLForExporting = (
  type: MDEntityForExporting,
  accountName: string,
  workspace: string
) =>
  `https://${workspace}--${accountName}.myvtex.com/_v/export/${
    type === 'affiliatesOrders' ? 'affiliateOrders' : 'commissionBySKU'
  }`

export const getAdminUserEmail = (token: string) => {
  const [, payload] = token.split('.', 3)
  const data: { sub?: string } = JSON.parse(
    Buffer.from(payload, 'base64').toString('utf-8')
  )

  return data?.sub
}
