import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { postal_code, delivery_zone_id } = await req.json();

    let zone = null;

    if (delivery_zone_id) {
      const { data } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('id', delivery_zone_id)
        .eq('is_active', true)
        .single();
      zone = data;
    } else if (postal_code) {
      const { data } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('postal_code', postal_code)
        .eq('is_active', true)
        .single();
      zone = data;
    }

    const delivery_fee = zone ? Number(zone.delivery_fee) : 15;
    const zone_name = zone?.name ?? null;

    return new Response(
      JSON.stringify({ delivery_fee, zone_name }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
