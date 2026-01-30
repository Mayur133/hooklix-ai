import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify CRON_SECRET for authentication
    const authHeader = req.headers.get("Authorization");
    const expectedToken = Deno.env.get("CRON_SECRET");
    
    if (!expectedToken) {
      console.error("CRON_SECRET not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfiguration" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      console.log("Unauthorized request - invalid or missing CRON_SECRET");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    console.log("Authorized cron request received");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, skipping email sending");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email notifications disabled (no RESEND_API_KEY)",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get users who:
    // 1. Have email notifications enabled
    // 2. Haven't been notified in the last 7 days
    // 3. Have done at least one analysis
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: eligibleUsers, error: usersError } = await supabase
      .from("user_preferences")
      .select(`
        user_id,
        last_notification_sent,
        profiles!inner(email, is_premium)
      `)
      .eq("email_notifications", true)
      .or(`last_notification_sent.is.null,last_notification_sent.lt.${sevenDaysAgo.toISOString()}`);

    if (usersError) {
      console.error("Error fetching eligible users:", usersError);
      throw usersError;
    }

    console.log(`Found ${eligibleUsers?.length || 0} eligible users for notification`);

    const notifiedUsers: string[] = [];
    const errors: string[] = [];

    for (const userPref of eligibleUsers || []) {
      // Check if user has done any analysis
      const { data: analysisHistory, error: historyError } = await supabase
        .from("analysis_history")
        .select("id, channel_name, created_at")
        .eq("user_id", userPref.user_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (historyError) {
        console.error(`Error checking history for user ${userPref.user_id}:`, historyError);
        continue;
      }

      // Only notify users who have done at least one analysis
      if (!analysisHistory || analysisHistory.length === 0) {
        console.log(`User ${userPref.user_id} has no analysis history, skipping`);
        continue;
      }

      const lastAnalysis = analysisHistory[0];
      const profile = userPref.profiles as any;
      const userEmail = profile?.email;

      if (!userEmail) {
        console.log(`User ${userPref.user_id} has no email, skipping`);
        continue;
      }

      try {
        // Send email using Resend API directly
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Creators Analytics AI <onboarding@resend.dev>",
            to: [userEmail],
            subject: "Time to re-analyze your channel! 📊",
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
                    <h1 style="color: white; margin: 0; font-size: 24px;">Creators Analytics AI</h1>
                  </div>
                  <div style="padding: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 16px;">It's time for a channel check-up! 🔍</h2>
                    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px;">
                      Hey there! It's been 7 days since your last analysis${lastAnalysis.channel_name ? ` of <strong>${lastAnalysis.channel_name}</strong>` : ''}.
                    </p>
                    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
                      Re-analyzing your channel regularly helps you track progress, spot new opportunities, and stay on top of your growth strategy.
                    </p>
                    <a href="https://creatorsanalyticsai.lovable.app/select" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ef4444 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">
                      Analyze Now →
                    </a>
                  </div>
                  <div style="padding: 20px 30px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                      You're receiving this because you enabled email notifications.<br>
                      <a href="https://creatorsanalyticsai.lovable.app/settings" style="color: #9333ea;">Manage preferences</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          throw new Error(errorData.message || "Failed to send email");
        }

        const emailResult = await emailResponse.json();
        console.log(`Email sent to ${userEmail}:`, emailResult);

        // Update last_notification_sent
        const { error: updateError } = await supabase
          .from("user_preferences")
          .update({ last_notification_sent: new Date().toISOString() })
          .eq("user_id", userPref.user_id);

        if (updateError) {
          console.error(`Error updating notification time for user ${userPref.user_id}:`, updateError);
          continue;
        }

        notifiedUsers.push(userPref.user_id);
      } catch (emailError: any) {
        console.error(`Failed to send email to ${userEmail}:`, emailError);
        errors.push(`${userEmail}: ${emailError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${notifiedUsers.length} email notifications`,
        notifiedUsers,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-analysis-reminders:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
