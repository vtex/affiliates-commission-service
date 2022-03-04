import type { ReadStream } from 'fs'
import { Readable } from 'stream'

import getStream from 'get-stream'
import { read, utils } from 'xlsx'
import FormData from 'form-data'
import { v4 as uuid } from 'uuid'

import { getAdminUserEmail } from '../utils/exporting'

export const lastImportBucket = 'last-import'

export type LastImportFileInfo = {
  fileId: string
  filename: string
  uploadDate: string
  uploadedBy: string
}

interface FileUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => ReadStream
}

export class ImportCommissionsService {
  private file: FileUpload
  private ctx: Context
  private buffer: Buffer
  constructor(file: FileUpload, ctx: Context) {
    this.file = file
    this.ctx = ctx
    this.buffer = Buffer.from('')
  }

  private requiredHeaders = ['id', 'commission']
  private appId = 'vtex.affiliates-commission-service'

  public initializeBuffer = async () => {
    const {
      file: { createReadStream },
    } = this

    const stream = createReadStream()

    this.buffer = await getStream.buffer(stream)
  }

  public validateHeaderRow = async () => {
    const { buffer, requiredHeaders } = this

    const workbook = read(buffer, { type: 'buffer', sheetRows: 1 })

    const [sheetName] = workbook.SheetNames

    const sheet = workbook.Sheets[sheetName]

    const [headerRow] = utils.sheet_to_json<string[]>(sheet, { header: 1 })

    requiredHeaders.forEach((header) => {
      if (!headerRow.includes(header)) {
        throw new Error(
          `The file must contain the following headers: ${requiredHeaders.join(
            ', '
          )}`
        )
      }
    })
  }

  public saveToVBase = async () => {
    const {
      ctx: {
        clients: { vbase },
        vtex: { adminUserAuthToken },
      },
      file: { filename },
      buffer,
    } = this

    const { fileId: oldFileId } = await vbase.getJSON<LastImportFileInfo>(
      lastImportBucket,
      'info'
    )

    oldFileId && (await vbase.deleteFile(lastImportBucket, oldFileId))

    const newFileId = uuid()

    await vbase.saveJSON(lastImportBucket, 'info', {
      fileId: newFileId,
      filename,
      uploadDate: new Date().toISOString(),
      uploadedBy: getAdminUserEmail(adminUserAuthToken ?? ''),
    })

    const readable = Readable.from(buffer)

    await vbase.saveFile(lastImportBucket, newFileId, readable)
  }

  public sendFileForProcessing = async () => {
    const {
      ctx: {
        clients: { spreadsheetEventBroadcaster },
      },
      buffer,
      appId,
    } = this

    const formData = new FormData()

    const readable = Readable.from(buffer)

    formData.append('file', readable)
    formData.append('appId', appId)

    await spreadsheetEventBroadcaster.notify(formData)
  }
}
