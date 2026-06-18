/**
 * Server-side email template registry for the Resend provider.
 *
 * Resend has no concept of a "template alias" like Postmark, so we render the
 * HTML ourselves. Each entry maps a template alias to a function that takes the
 * template variables and returns the subject + HTML body.
 *
 * To add a new template, register a new alias here.
 */

export interface RenderedTemplate {
  subject: string;
  html: string;
}

export type TemplateRenderer = (variables: Record<string, string>) => RenderedTemplate;

const baseLayout = (title: string, body: string): string => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:32px;">
            <tr><td style="font-size:20px;font-weight:bold;color:#222;padding-bottom:16px;">Vite &amp; Gourmand</td></tr>
            ${body}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const button = (url: string, label: string): string =>
  `<a href="${url}" style="display:inline-block;background:#e8542b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">${label}</a>`;

export const RESEND_TEMPLATE_REGISTRY: Record<string, TemplateRenderer> = {
  'activate-account': (variables) =>
    ({
      subject: 'Activez votre compte Vite & Gourmand',
      html: baseLayout(
        'Activez votre compte',
        `<tr><td style="color:#444;line-height:1.6;padding-bottom:24px;">
            Bienvenue ! Merci de votre inscription. Veuillez confirmer votre adresse email pour activer votre compte.
          </td></tr>
          <tr><td style="padding-bottom:24px;">${button(variables.validateAccountUrl ?? '#', 'Activer mon compte')}</td></tr>
          <tr><td style="color:#888;font-size:12px;">Si le bouton ne fonctionne pas, copiez ce lien : ${variables.validateAccountUrl ?? ''}</td></tr>`,
      ),
    }) satisfies RenderedTemplate,

  'reset-password': (variables) =>
    ({
      subject: 'Réinitialisation de votre mot de passe',
      html: baseLayout(
        'Réinitialisation du mot de passe',
        `<tr><td style="color:#444;line-height:1.6;padding-bottom:24px;">
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
          </td></tr>
          <tr><td style="padding-bottom:24px;">${button(variables.resetPasswordUrl ?? '#', 'Réinitialiser mon mot de passe')}</td></tr>
          <tr><td style="color:#888;font-size:12px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</td></tr>`,
      ),
    }) satisfies RenderedTemplate,

  'employee-set-password': (variables) =>
    ({
      subject: 'Définissez votre mot de passe',
      html: baseLayout(
        'Définissez votre mot de passe',
        `<tr><td style="color:#444;line-height:1.6;padding-bottom:24px;">
            Un compte employé a été créé pour vous. Cliquez ci-dessous pour définir votre mot de passe.
          </td></tr>
          <tr><td style="padding-bottom:24px;">${button(variables.setPasswordUrl ?? '#', 'Définir mon mot de passe')}</td></tr>`,
      ),
    }) satisfies RenderedTemplate,
};
