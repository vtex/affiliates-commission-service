import type { LastImportFileInfo } from '../../services/ImportCommissionsService'
import { lastImportBucket } from '../../services/ImportCommissionsService'

export async function getLastImportedFile(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    vtex: {
      route: {
        params: { fileId },
      },
    },
    clients: { vbase },
  } = ctx

  const { filename } = await vbase.getJSON<LastImportFileInfo>(
    'last-import',
    'info'
  )

  if (!filename) {
    ctx.status = 500
    ctx.body = {
      message: 'Error while fetching filename',
    }

    return
  }

  const file = await vbase.getFileStream(lastImportBucket, `${fileId}`)

  if (!file) {
    ctx.status = 204
    ctx.body = {
      message: 'File not found',
    }

    return
  }

  const fileExtension = filename.split('.').pop()

  if (fileExtension === 'csv') {
    ctx.res.setHeader('Content-Type', 'text/csv')
  } else if (fileExtension === 'xlsx') {
    ctx.res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  }

  ctx.res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  ctx.body = file
  ctx.status = 200

  await next()
}
