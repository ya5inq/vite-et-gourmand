import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivering'],
  delivering: ['completed'],
  completed: [],
  cancelled: [],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { order_id, new_status, notes } = await req.json();

    // Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) throw new Error('Commande introuvable');

    const currentStatus = order.status;
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowedTransitions.includes(new_status)) {
      throw new Error(`Transition invalide: ${currentStatus} -> ${new_status}`);
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create history entry
    await supabase.from('order_history').insert({
      order_id,
      old_status: currentStatus,
      new_status,
      changed_by: user.id,
      notes: notes ?? null,
    });

    return new Response(
      JSON.stringify({ success: true, order: updatedOrder }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
