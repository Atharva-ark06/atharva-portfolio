import { json } from '@remix-run/cloudflare';
import { getSessionStorage } from '~/utils/session.server';

export async function action({ request, context }) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');

  if (origin && origin !== requestUrl.origin) {
    return json({ status: 'error' }, { status: 403 });
  }

  const formData = await request.formData();
  const theme = formData.get('theme');

  if (theme !== 'dark' && theme !== 'light') {
    return json({ status: 'error', message: 'Invalid theme value.' }, { status: 400 });
  }

  const { getSession, commitSession } = getSessionStorage(context);
  const session = await getSession(request.headers.get('Cookie'));
  session.set('theme', theme);

  return json(
    { status: 'success' },
    { headers: { 'Set-Cookie': await commitSession(session) } }
  );
}
