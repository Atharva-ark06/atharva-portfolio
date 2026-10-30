import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from '@remix-run/cloudflare';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let statusCode = responseStatusCode;

  const body = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
      abortDelay={5000}
    />,
    {
      signal: request.signal,
      onError(error) {
        statusCode = 500;
        console.error('SSR rendering error:', error);
      },
    }
  );

  // Crawlers receive the completed document for reliable metadata indexing.
  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html; charset=utf-8');

  return new Response(body, {
    headers: responseHeaders,
    status: statusCode,
  });
}
