import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
}

interface ChannelData {
  channelId: string;
  channelName: string;
  channelUrl: string;
  videos: VideoData[];
}

// Extract channel ID from various YouTube URL formats
async function extractChannelId(input: string): Promise<string | null> {
  console.log('Extracting channel ID from:', input);
  
  // Clean up input
  input = input.trim();
  
  // Direct channel ID (starts with UC)
  if (input.startsWith('UC') && input.length === 24) {
    return input;
  }
  
  // Channel URL with ID: youtube.com/channel/UC...
  const channelIdMatch = input.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/);
  if (channelIdMatch) {
    return channelIdMatch[1];
  }
  
  // Handle @username format: youtube.com/@username or just @username
  let handle = null;
  const handleMatch = input.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/);
  if (handleMatch) {
    handle = handleMatch[1];
  } else if (input.startsWith('@')) {
    handle = input.substring(1);
  }
  
  if (handle) {
    console.log('Resolving handle:', handle);
    // Fetch the channel page to get the channel ID
    try {
      const response = await fetch(`https://www.youtube.com/@${handle}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await response.text();
      
      // Look for channel ID in the page
      const cidMatch = html.match(/\"channelId\":\"(UC[a-zA-Z0-9_-]{22})\"/);
      if (cidMatch) {
        console.log('Found channel ID from handle:', cidMatch[1]);
        return cidMatch[1];
      }
      
      // Alternative pattern
      const altMatch = html.match(/channel_id=([A-Za-z0-9_-]{24})/);
      if (altMatch) {
        return altMatch[1];
      }
    } catch (e) {
      console.error('Error resolving handle:', e);
    }
  }
  
  // Video URL: youtube.com/watch?v=VIDEO_ID - need to get channel from video page
  const videoMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (videoMatch) {
    const videoId = videoMatch[1];
    console.log('Resolving video ID:', videoId);
    try {
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await response.text();
      
      const cidMatch = html.match(/\"channelId\":\"(UC[a-zA-Z0-9_-]{22})\"/);
      if (cidMatch) {
        console.log('Found channel ID from video:', cidMatch[1]);
        return cidMatch[1];
      }
    } catch (e) {
      console.error('Error resolving video:', e);
    }
  }
  
  // Custom URL: youtube.com/c/customname or youtube.com/user/username
  const customMatch = input.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9_-]+)/);
  if (customMatch) {
    const customName = customMatch[1];
    console.log('Resolving custom URL:', customName);
    try {
      const response = await fetch(`https://www.youtube.com/c/${customName}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await response.text();
      
      const cidMatch = html.match(/\"channelId\":\"(UC[a-zA-Z0-9_-]{22})\"/);
      if (cidMatch) {
        return cidMatch[1];
      }
    } catch (e) {
      console.error('Error resolving custom URL:', e);
    }
  }
  
  return null;
}

// Parse YouTube RSS feed XML
function parseRSSFeed(xml: string, channelId: string): ChannelData {
  const videos: VideoData[] = [];
  
  // Extract channel name
  const channelNameMatch = xml.match(/<name>([^<]+)<\/name>/);
  const channelName = channelNameMatch ? channelNameMatch[1] : 'Unknown Channel';
  
  // Extract channel URL
  const channelUrlMatch = xml.match(/<uri>([^<]+)<\/uri>/);
  const channelUrl = channelUrlMatch ? channelUrlMatch[1] : `https://www.youtube.com/channel/${channelId}`;
  
  // Extract video entries
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch;
  
  while ((entryMatch = entryRegex.exec(xml)) !== null && videos.length < 10) {
    const entry = entryMatch[1];
    
    // Video ID
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    
    // Title
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    
    // Published date
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : '';
    
    // Description (media:description)
    const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
    const description = descMatch ? descMatch[1] : '';
    
    if (videoId) {
      videos.push({
        id: videoId,
        title: decodeHTMLEntities(title),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt,
        description: decodeHTMLEntities(description),
      });
    }
  }
  
  return {
    channelId,
    channelName: decodeHTMLEntities(channelName),
    channelUrl,
    videos,
  };
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.log('Invalid JWT token:', claimsError?.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const { channelUrl } = await req.json();
    
    if (!channelUrl) {
      console.log('No channel URL provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Channel URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing channel URL:', channelUrl);

    // Extract channel ID
    const channelId = await extractChannelId(channelUrl);
    
    if (!channelId) {
      console.log('Could not extract channel ID');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not find channel. Please provide a valid YouTube channel URL, @username, or video link.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracted channel ID:', channelId);

    // Fetch RSS feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    console.log('Fetching RSS feed:', rssUrl);
    
    const rssResponse = await fetch(rssUrl);
    
    if (!rssResponse.ok) {
      console.log('RSS feed fetch failed:', rssResponse.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not fetch channel feed. The channel may not exist or has no public videos.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rssXml = await rssResponse.text();
    console.log('RSS feed fetched, parsing...');
    
    // Parse the feed
    const channelData = parseRSSFeed(rssXml, channelId);
    
    console.log('Parsed channel:', channelData.channelName, 'Videos:', channelData.videos.length);

    return new Response(
      JSON.stringify({ success: true, data: channelData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
