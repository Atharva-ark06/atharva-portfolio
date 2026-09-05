import { json, createCookieSessionStorage } from '@remix-run/cloudflare';

export async function action({ request, context }) {
  const formData = await request.formData();
  const theme = formData.get('theme');

  const sessionSecret =
    context?.cloudflare?.env?.SESSION_SECRET || 'development-secret';

  const isSecure = new URL(request.url).protocol === 'https:';

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: isSecure,
    },
  });

  const session = await getSession(request.headers.get('Cookie'));

  session.set('theme', theme);

  return json(
    { status: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
}