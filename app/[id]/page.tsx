// app/[id]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

async function getRedirectUrl(id: string) {
    const { data, error } = await supabase
        .from('url_mappings')
        .select('long_url')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error retrieving from Supabase:', error);
        return null;
    }

    return data.long_url;
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
    const longUrl = await getRedirectUrl(params.id);

    if (longUrl) {
        redirect(longUrl);
    } else {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                <p className="text-xl">The requested short URL does not exist.</p>
            </div>
        );
    }
}