import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'
import type FormData from 'form-data'

export class SpreadsheetEventBroadcaster extends AppClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.spreadsheet-event-broadcaster@0.x', context, {
      ...options,
      headers: {
        ...options?.headers,
        ...(context.authToken
          ? { VtexIdclientAutCookie: context.authToken }
          : null),
      },
    })
  }

  public notify = (formData: FormData) => {
    return this.http.post(`/notify`, formData, {
      headers: { ...formData.getHeaders() },
    })
  }
}
