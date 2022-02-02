import type { CreateEmailPayload } from '../clients/messageCenter'
import type { MDEntityForExporting } from './exporting'

export const EMAIL_TEMPLATE_TO = '{{email}}'
export const emailTemplateName = (type: MDEntityForExporting) =>
  type === 'affiliatesOrders'
    ? 'affiliate-orders-export'
    : 'commissions-by-sku-export'
export const emailTemplateSubject = (type: MDEntityForExporting) =>
  type === 'affiliatesOrders'
    ? 'Planilha de pedidos de afiliados'
    : 'Planilha de comissionamento por SKU'
export const emailMessage = (type: MDEntityForExporting) => `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="initial-scale=1.0">
    <!-- So that mobile webkit will display zoomed in -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <title>{{_accountInfo.TradingName}}</title>
    <style type="text/css">
        p {
            font-family: Fabriga, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
        };
        .vtex-button {
            border-width: .125rem;
            border-style: solid;
            font-weight: 500;
            vertical-align: middle;
            padding: 0;
            line-height: 1;
            border-radius: .25rem;
            min-height: 2.5rem;
            box-sizing: border-box;
            font-family: Fabriga, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0;
            background-color: #134cd8;
            border-color: #134cd8;
            color: #fff;
            cursor: pointer;
        };
    </style>
</head>

<body marginwidth="0" marginheight="0" bgcolor="#fff" style="padding:0px 0px;color:#333;" leftmargin="0" topmargin="0">
    <!-- 100% wrapper (grey background) -->
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" align="left" valign="top">
        <tbody>
            <tr>
                <td align="center" valign="top">
                    <table width="100%" style="max-width: 36rem;" align="center" cellpadding="0" cellspacing="0"
                        border="0" valign="top">
                        <tbody>
                            <tr>
                                <td>
                                    <div
                                        style="border:1px solid #e3e4e6;border-radius:8px;margin-top:1rem;margin-bottom:1rem;padding-top:3rem;padding-right:3rem;padding-bottom:3rem;padding-left:3rem">
                                        <img src="https://master--qamarketplace.myvtex.com/_v/public/assets/v1/published/vtex.messages-templates@0.1.12/public/react/cdbfb2a8b730a7ee840752d7af7ddc1c.png"
                                            width="77px" height="28px"
                                            style="display:block;outline:none;border:none;text-decoration:none"
                                            class="CToWUd">
                                        <p style="font-size:24px;color:#25354d;margin-bottom:32px">
                                            <strong>${
                                              type === 'affiliatesOrders'
                                                ? 'Planilha de pedidos de afiliados exportada'
                                                : 'Planilha de comissionamento por SKU exportada'
                                            }</strong></p>
                                        <p style="font-size:16px;color:#3f3f40;margin-bottom:32px">
                                            Olá,</p>
                                        <p style="font-size:16px;color:#3f3f40">
                                            ${
                                              type === 'affiliatesOrders'
                                                ? 'Segue o link para baixar a planilha pedidos de afiliados.'
                                                : 'Segue o link para baixar a planilha de comissionamento por SKU.'
                                            }
                                        </p>
                                        <div style="margin-bottom: 24px">
                                            <a href="{{link}}" download>
                                                <button
                                                    style="border-width: .125rem; border-style: solid; font-weight: 500; vertical-align: middle; padding: 0; line-height: 1; border-radius: .25rem; min-height: 2.5rem;  box-sizing: border-box; font-family: Fabriga, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;  font-size: 1rem;  text-transform: uppercase;  letter-spacing: 0; background-color: #134cd8; border-color: #134cd8;  color: #fff; cursor: pointer;"
                                                    type="button">
                                                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding-left: 1.5rem; padding-right: 1.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem;">
                                                        Baixar Planilha
                                                    </div>
                                                </button>
                                            </a>
                                        </div>
                                        <p style="margin-bottom:4px;font-size:16px;color:#3f3f40">
                                            Abraços,</p>
                                        <p style="margin-top:0px;font-size:16px;color:#3f3f40">
                                            VTEX</p><br>
                                        <p style="font-size:12px;color:#727273;margin-bottom:0px">
                                            O link para download é válido por 24 horas. Após esse tempo, será necessário realizar a exportação novamente.
                                        </p>
                                        <div
                                            style="color:#e3e4e6;border-top:1px solid #e3e4e6;border-bottom:0px solid #e3e4e6;margin-bottom:2rem;margin-top:1rem">
                                        </div>
                                        <p style="font-size:12px;color:#727273;margin-bottom:0px">
                                            Esse email é enviado automaticamente e não recebe respostas.
                                        </p>
                                        <p style="font-size:12px;color:#727273;margin-top:.25rem;margin-bottom:0px">
                                            Precisa de ajuda? <a href="https://help.vtex.com/?locale=pt" alt="VTEX Help"
                                                style="font-weight:bold;color:#3F3F40">Fale Conosco</a>
                                        </p><br>
                                        <p style="font-size:12px;color:#727273;margin-bottom:0px">
                                            © VTEX Praia de Botafogo, 300, 3º Andar, Botafogo, Rio de Janeiro, RJ,
                                            22250-040
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <!--/600px container -->
    <!--/100% wrapper-->
</body>

</html>
`

export const emailTemplateData = (
  type: MDEntityForExporting
): CreateEmailPayload => ({
  ApplicationId: undefined,
  Description: undefined,
  FriendlyName: emailTemplateName(type),
  Name: emailTemplateName(type),
  Templates: {
    email: {
      CC: undefined,
      isActive: true,
      Message: emailMessage(type),
      ProviderId: undefined,
      Subject: emailTemplateSubject(type),
      To: EMAIL_TEMPLATE_TO,
      Type: 'E',
    },
    sms: {
      Type: 'S',
      ProviderId: undefined,
      isActive: false,
      Parameters: [],
    },
  },
})
