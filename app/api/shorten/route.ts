// api/shorten/route.ts
import { nanoid } from "nanoid";

export async function POST(request: Request) {
    try {
        const { longUrl } = await request.json();

        // Set CORS headers to allow public access from any domain
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow any domain to access this API
            "Access-Control-Allow-Methods": "POST, OPTIONS", // Define allowed methods
            "Access-Control-Allow-Headers": "Content-Type",  // Define allowed headers
        };

        // Handle CORS preflight requests (OPTIONS method)
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204, // No Content
                headers,
            });
        }

        // Validate longUrl existence
        if (!longUrl) {
            return new Response(JSON.stringify({ error: "No URL provided" }), {
                status: 400,
                headers,
            });
        }

        // Optional: Validate URL format
        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (!urlPattern.test(longUrl)) {
            return new Response(JSON.stringify({ error: "Invalid URL format" }), {
                status: 400,
                headers,
            });
        }

        // Generate a unique short ID using nanoid
        const id = nanoid(6);

        // Ensure the base URL is properly set in the environment variable
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
            return new Response(JSON.stringify({ error: "Server misconfiguration: Missing base URL" }), {
                status: 500,
                headers,
            });
        }

        // Create the shortened URL
        const shortUrl = `${baseUrl}/${id}`;

        // Return the shortened URL
        return new Response(JSON.stringify({ shortUrl }), {
            status: 200,
            headers,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }
}