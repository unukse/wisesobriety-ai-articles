// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from Functions!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckInData {
  id: string
  user_id: string
  emotional_state: string
  alcohol_consumption: string
  craving_triggers: string[]
  coping_strategies: string[]
  proud_of: string
  motivation_rating: number
  support_need: string
  created_at: string
}

interface SummaryRequest {
  checkInId: string
  userId: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

    if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
      throw new Error('Missing required environment variables')
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { checkInId, userId }: SummaryRequest = await req.json()

    if (!checkInId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing checkInId or userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the check-in data from database
    const { data: checkIn, error: fetchError } = await supabase
      .from('check_ins')
      .select('*')
      .eq('id', checkInId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !checkIn) {
      console.error('Error fetching check-in:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Check-in not found or access denied' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare the prompt for OpenAI
    const prompt = createSummaryPrompt(checkIn)

    // Call OpenAI API
    const summary = await generateOpenAISummary(prompt, openaiApiKey)

    if (!summary) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate summary' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update the check-in with the AI summary
    const { error: updateError } = await supabase
      .from('check_ins')
      .update({ 
        ai_summary: summary,
        updated_at: new Date().toISOString()
      })
      .eq('id', checkInId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating check-in with summary:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to save summary' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        summary,
        checkInId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
  return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function createSummaryPrompt(checkIn: CheckInData): string {
  const date = new Date(checkIn.created_at).toLocaleDateString()
  
  return `As a supportive AI assistant for someone in recovery from alcohol addiction, please provide a compassionate and insightful summary of this daily check-in from ${date}.

Check-in Details:
- Emotional State: "${checkIn.emotional_state}"
- Alcohol Consumption: "${checkIn.alcohol_consumption}"
- Craving Triggers: ${checkIn.craving_triggers.length > 0 ? checkIn.craving_triggers.join(', ') : 'None reported'}
- Coping Strategies Used: ${checkIn.coping_strategies.length > 0 ? checkIn.coping_strategies.join(', ') : 'None reported'}
- What They're Proud Of: "${checkIn.proud_of}"
- Motivation Level: ${checkIn.motivation_rating}/10
- Support Needed: "${checkIn.support_need}"

Please provide a 2-3 paragraph summary that:
1. Acknowledges their emotional state and progress
2. Highlights positive coping strategies and achievements
3. Offers gentle encouragement and support
4. Suggests actionable next steps based on their needs
5. Maintains a warm, supportive tone throughout

Keep the summary under 200 words and focus on being encouraging and helpful.`
}

async function generateOpenAISummary(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate AI assistant supporting people in recovery from alcohol addiction. Provide warm, encouraging, and helpful responses that acknowledge progress and offer gentle support.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return null
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || null

  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return null
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-checkin-summary' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
