import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Monastery knowledge base
const monasteryKnowledge = `
Sikkim Monastery Information:

RUMTEK MONASTERY:
- Location: East Sikkim, 24km from Gangtok
- Founded: 1740, rebuilt 1960s
- School: Karma Kagyu lineage
- Features: Largest monastery in Sikkim, golden stupa, sacred relics
- Altitude: 5,500 feet

PEMAYANGTSE MONASTERY:
- Location: Pelling, West Sikkim
- Founded: 1705 by Lama Lhatsun Chempo
- School: Nyingma
- Features: Only pure Tibetan lineage monks admitted, seven-tiered wooden sculpture
- Views: Spectacular Kanchenjunga views

ENCHEY MONASTERY:
- Location: Gangtok ridge
- Founded: 1909
- School: Nyingma
- Features: 90 monks, annual Chaam dance, Kanchenjunga views
- Legend: Built on site blessed by flying tantric master

TASHIDING MONASTERY:
- Location: West Sikkim, between two rivers
- Founded: 1717
- Features: Sacred Bumchu festival, pilgrimage site, sin-washing beliefs
- Setting: Hilltop location with panoramic mountain views

DUBDI MONASTERY:
- Location: Near Yuksom
- Founded: 1701
- Significance: Oldest monastery in Sikkim, ancient capital nearby
- Founded by: Lhatsun Namkha Jigme

Cultural Events:
- Losar: Tibetan New Year (February/March)
- Saga Dawa: Buddha's enlightenment celebration
- Pang Lhabsol: Guardian deity festival with masked dances
- Bumchu: Sacred water ceremony at Tashiding

Architecture: Traditional Tibetan style with colorful decorations, prayer wheels, and stupas.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Received message:', message);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable guide for Sikkim monasteries. Use this information to answer questions about monasteries in Sikkim: ${monasteryKnowledge}
            
            Provide detailed, accurate information about:
            - Monastery history, founding dates, and founders
            - Architectural features and significance
            - Cultural events and festivals
            - Practical visiting information
            - Buddhist schools and traditions
            - Scenic locations and views
            
            Always be respectful of religious and cultural aspects. If asked about monasteries not in Sikkim, politely redirect to Sikkim monasteries.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    if (data.error) {
      throw new Error(`OpenAI API Error: ${data.error.message}`);
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }
    
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in monastery-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});