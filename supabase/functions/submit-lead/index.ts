import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Brand constants for email templates
const BRAND = {
  name: "Lux Connoisseurs",
  tagline: "Private Access to Luxury Experiences",
  phone: "+1 (678) 335 8105",
  email: "luxconnoisseurs@gmail.com",
  website: "https://luxconnoisseurs.com",
};

interface LeadData {
  name: string;
  email: string;
  phone: string;
  city: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  category: string;
  offer: string;
  offerCity: string;
  pageUrl: string;
  source: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get("MAKE_WEBHOOK_URL");
    
    if (!webhookUrl) {
      console.error("[Lux Connoisseurs] MAKE_WEBHOOK_URL not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const leadData: LeadData = await req.json();

    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone || !leadData.city) {
      console.warn("[Lux Connoisseurs] Missing required fields in lead submission");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format dates for Google Sheets
    const formattedData = {
      // Brand information for email templates in Make.com
      brand: BRAND,
      // Lead data
      ...leadData,
      preferredDates: leadData.startDate && leadData.endDate 
        ? `${leadData.startDate} to ${leadData.endDate}`
        : leadData.startDate || "Not specified",
    };

    console.log(`[Lux Connoisseurs] Submitting lead for ${leadData.category} - ${leadData.offerCity}`);
    console.log(`[Lux Connoisseurs] Lead details: ${leadData.name} (${leadData.email})`);

    // Send to Make.com webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      console.error(`[Lux Connoisseurs] Make.com webhook error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: "Failed to submit lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Lux Connoisseurs] Lead submitted successfully for ${leadData.name}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for your inquiry. A Lux Connoisseurs representative will contact you shortly." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Lux Connoisseurs] Error submitting lead:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});