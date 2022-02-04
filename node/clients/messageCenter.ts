import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export interface MailPayload {
  templateName: string
  jsonData: Record<string, string>
}

export type EmailType = {
  CC?: string
  isActive: boolean
  Message: string
  ProviderId?: string
  Subject: string
  To: string
  Type: 'E'
}

export type SMSType = {
  ProviderId?: string
  Type: 'S'
  isActive: boolean
  Parameters?: Array<Record<string, unknown>>
}

export interface CreateEmailPayload {
  ApplicationId?: string
  Description?: string
  FriendlyName: string
  Name: string
  Templates: {
    email: EmailType
    sms: SMSType
  }
}

export default class MessageCenterClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public sendMail = (data: MailPayload) =>
    this.http.post(
      `/api/mail-service/pvt/sendmail?an=${this.context.account}`,
      data
    )

  public createTemplate = (data: CreateEmailPayload) =>
    this.http.post(
      `/api/template-render/pvt/templates?an=${this.context.account}`,
      data
    )
}
