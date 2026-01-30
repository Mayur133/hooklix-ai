import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RatingPayload {
  rating: number;
  feedback: string | null;
  pageName: string;
  userEmail: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const payload: RatingPayload = await req.json();
    const { rating, feedback, pageName, userEmail } = payload;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Invalid rating" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, skipping email notification");
      return new Response(
        JSON.stringify({ success: true, message: "Rating saved, email notification disabled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Send email notification to admin
    const starsDisplay = "★".repeat(rating) + "☆".repeat(5 - rating);
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hooklix AI <onboarding@resend.dev>",
        to: ["hooklixai@gmail.com"],
        subject: `⭐ New Rating: ${rating}/5 from ${userEmail}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              <div style="background: linear-gradient(135deg, #9333ea 0%, #ef4444 50%, #f59e0b 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Rating Received</h1>
              </div>
              <div style="padding: 30px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 36px; color: #f59e0b;">${starsDisplay}</span>
                  <p style="color: #6b7280; margin: 8px 0 0;">${rating} out of 5 stars</p>
                </div>
                
                <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                  <p style="color: #374151; margin: 0 0 8px;"><strong>User:</strong> ${userEmail}</p>
                  <p style="color: #374151; margin: 0 0 8px;"><strong>Page:</strong> ${pageName}</p>
                  <p style="color: #374151; margin: 0;"><strong>Time:</strong> ${timestamp}</p>
                </div>

                ${feedback ? `
                <div style="background: #fef3c7; border-radius: 8px; padding: 16px;">
                  <p style="color: #92400e; margin: 0 0 8px;"><strong>Feedback:</strong></p>
                  <p style="color: #78350f; margin: 0;">${feedback}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    console.log("Rating notification email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Rating notification sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-rating-notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
