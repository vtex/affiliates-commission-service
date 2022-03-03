import type { ReadStream } from 'fs'

import getStream from 'get-stream'
import { read, utils } from 'xlsx'

export const REQUIRED_HEADERS = ['id', 'commission']

export const getHeaderRowFromStream = async (stream: ReadStream) => {
  const buffer = await getStream.buffer(stream)

  const workbook = read(buffer, { type: 'buffer', sheetRows: 1 })

  const [sheetName] = workbook.SheetNames

  const sheet = workbook.Sheets[sheetName]

  const [payload] = utils.sheet_to_json<string[]>(sheet, { header: 1 })

  return payload
}
