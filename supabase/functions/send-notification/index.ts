import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();

    // Log the notification (replace with actual email service like Resend, Postmark, etc.)
    console.log(`[Notification] Type: ${type}, To: ${to}`);
    console.log(`[Notification] Data:`, JSON.stringify(data));

    let subject = '';
    let body = '';

    switch (type) {
      case 'order_confirmation':
        subject = `Confirmation de commande #${data.order_id}`;
        body = `Votre commande a été confirmée. Menu: ${data.menu_name}, Total: ${data.total_price}€`;
        break;
      case 'welcome':
        subject = 'Bienvenue chez Vite & Gourmand';
        body = `Bonjour ${data.first_name}, bienvenue sur notre plateforme de commande traiteur !`;
        break;
      case 'contact':
        subject = `Nouveau message de contact de ${data.name}`;
        body = `Message: ${data.message}`;
        break;
      default:
        throw new Error(`Type de notification inconnu: ${type}`);
    }

    console.log(`[Notification] Subject: ${subject}`);
    console.log(`[Notification] Body: ${body}`);

    // TODO: Integrate with email service
    // await sendEmail({ to, subject, body });

    return new Response(
      JSON.stringify({ success: true, subject }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
