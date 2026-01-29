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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
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

      // In a real implementation, you would send an email here
      // For now, we just log and update the last_notification_sent
      console.log(`Would send email to ${userEmail}:`, {
        subject: "Time to re-analyze your channel!",
        channelName: lastAnalysis.channel_name,
        lastAnalyzed: lastAnalysis.created_at,
      });

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
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${notifiedUsers.length} users for notification`,
        notifiedUsers,
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
