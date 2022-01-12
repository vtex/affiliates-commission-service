import {
  APP_KEY_HEADER,
  APP_TOKEN_HEADER,
  HTTP_ERRORS,
  MD_READ_PERMISSION,
} from '../utils/constants'

export async function authenticateRequest(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const { authentication, licenseManager } = ctx.clients
  const appKey = ctx.headers[APP_KEY_HEADER] as string
  const appToken = ctx.headers[APP_TOKEN_HEADER] as string

  if (!appKey || !appToken) {
    ctx.status = HTTP_ERRORS.missingAuthentication.status
    ctx.message = HTTP_ERRORS.missingAuthentication.message

    return
  }

  const { token } = await authentication.getAuthToken({
    appKey,
    appToken,
  })

  const canAccessMasterdata = await licenseManager.canAccessResource(
    token,
    MD_READ_PERMISSION
  )

  if (!canAccessMasterdata) {
    ctx.status = HTTP_ERRORS.forbidden.status
    ctx.message = HTTP_ERRORS.forbidden.message

    return
  }

  await next()
}
