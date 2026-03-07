export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { token, phone, position, dept } = await request.json();
    if (!token) return json({ error: 'No token' }, 401);

    // Verify session and get userId via Clerk Frontend API
    const meRes = await fetch('https://clerk.usholding.kz/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!meRes.ok) return json({ error: 'Invalid session' }, 401);
    const me = await meRes.json();
    const userId = me.id;

    // Save to Clerk publicMetadata via Backend API
    const updateRes = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_metadata: { phone, position, dept } })
    });
    if (!updateRes.ok) {
      const err = await updateRes.json();
      return json({ error: err }, 500);
    }
    return json({ success: true }, 200);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
