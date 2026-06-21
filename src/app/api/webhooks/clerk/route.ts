import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type UserProfileExtraUpsert = Database['public']['Tables']['user_profile_extra']['Insert'];

interface ClerkUserPayload {
  id: string;
  email_addresses: Array<{ email_address: string; id: string }>;
  first_name: string | null;
  last_name: string | null;
  primary_email_address_id: string | null;
}

interface WebhookEvent {
  type: string;
  data: ClerkUserPayload;
}

export async function POST(request: Request): Promise<NextResponse> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Get Svix headers for signature verification
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  // Read and verify the payload
  const body = await request.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const clerkUserId = data.id;

    const supabase = createSupabaseAdmin();

    const upsertPayload: UserProfileExtraUpsert = {
      clerk_user_id: clerkUserId,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('user_profile_extra').upsert(upsertPayload, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: 'Failed to sync user profile' }, { status: 500 });
    }

    console.log(`User profile synced for clerk_user_id: ${clerkUserId} (event: ${type})`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
