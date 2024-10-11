// api/shorten/route.ts
import { nanoid } from "nanoid";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { longUrl } = await request.json();
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (!longUrl) {
      return new Response(JSON.stringify({ error: "No URL provided" }), { status: 400, headers });
    }

    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlPattern.test(longUrl)) {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), { status: 400, headers });
    }

    const id = nanoid(6);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return new Response(JSON.stringify({ error: "Server misconfiguration: Missing base URL" }), { status: 500, headers });
    }

    const shortUrl = `${baseUrl}/${id}`;

    // Store the URL mapping in Supabase
    const { data, error } = await supabase
      .from('url_mappings')
      .insert({ id, long_url: longUrl, short_url: shortUrl })
      .select();

    if (error) {
      console.error('Error inserting into Supabase:', error);
      return new Response(JSON.stringify({ error: "Failed to create short URL" }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ shortUrl }), { status: 200, headers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400, headers });
  }

  // Retrieve the long URL from Supabase
  const { data, error } = await supabase
    .from('url_mappings')
    .select('long_url')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error retrieving from Supabase:', error);
    return new Response(JSON.stringify({ error: "Short URL not found" }), { status: 404, headers });
  }

  return new Response(JSON.stringify({ longUrl: data.long_url }), { status: 200, headers });
}