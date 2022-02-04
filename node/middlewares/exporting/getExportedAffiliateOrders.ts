import { bucketNameForExporting } from '../../utils/exporting'

export async function getExportedAffiliateOrders(
  {
    response,
    vtex: {
      route: {
        params: { fileName },
      },
    },
    clients: { vbase },
  }: Context,
  next: () => Promise<unknown>
) {
  const bucketName = bucketNameForExporting('affiliatesOrders')

  const file = await vbase.getJSON(bucketName, `${fileName}`, true)

  if (!file) {
    response.status = 204
    response.body = {
      message: 'File not found',
    }

    return
  }

  response.status = 200
  response.res.setHeader('Content-Type', 'text/csv')
  response.res.setHeader(
    'Content-Disposition',
    `attachment; filename=export.csv`
  )
  response.body = file

  await vbase.deleteFile(bucketName, `${fileName}`)

  await next()
}
