import { createCookieSessionStorage } from '@remix-run/cloudflare';

const LOCAL_SESSION_SECRET = 'local-only-session-secret-do-not-use-in-production';

export function getSessionStorage(context) {
  const configuredSecret = context?.cloudflare?.env?.SESSION_SECRET;
  const secret = configuredSecret || (import.meta.env.DEV ? LOCAL_SESSION_SECRET : '');

  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be configured with at least 32 characters in the deployment environment.');
  }

  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [secret],
      secure: !import.meta.env.DEV,
    },
  });
}
