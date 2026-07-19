import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// CSP Configuration
// ---------------------------------------------------------------------------
// Set to `true` to enforce CSP in production (blocks violations).
// Set to `false` to use report-only mode (logs violations without blocking).
const CSP_ENFORCE = true;

const isProd = process.env.NODE_ENV === 'production';

/**
 * Resolve the API origin from the environment variable.
 * Falls back to the default corestack.app origin.
 */
function getApiOrigin(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_REACT_APP_API_URL ||
    'https://corestack.app/mmcp/api/v1';
  try {
    return new URL(apiUrl).origin;
  } catch {
    return 'https://corestack.app';
  }
}

/**
 * Build the Content Security Policy directive string.
 *
 * @param nonce - A per-request cryptographic nonce (base64-encoded UUID).
 * @returns The complete CSP directive string.
 */
function buildCsp(nonce: string): string {
  const apiOrigin = getApiOrigin();

  // In dev, Next.js HMR / React fast-refresh requires eval().
  // We add 'unsafe-eval' ONLY in development to keep hot-reload working.
  const scriptSrc = isProd
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  // In dev, Next.js Turbopack injects inline <style> tags dynamically for HMR.
  // CSP spec: browsers IGNORE 'unsafe-inline' when a nonce is present.
  // So in dev we must omit the nonce to let 'unsafe-inline' work for all styles.
  // In prod, only our explicit <style nonce="..."> tags are allowed.
  const styleSrc = isProd
    ? `style-src 'self' 'nonce-${nonce}'`
    : `style-src 'self' 'unsafe-inline'`;

  return [
    // Default: deny everything not explicitly allowed
    "default-src 'self'",

    // Scripts: nonce-based with strict-dynamic cascade
    scriptSrc,

    // Styles: nonce-based for inline <style> tags (brand CSS vars)
    styleSrc,

    // Images: self, data URIs, S3 bucket, Google Maps tiles
    "img-src 'self' data: blob: https://mmcpdocs.s3.eu-west-2.amazonaws.com https://*.google.com https://*.googleapis.com https://*.gstatic.com",

    // Fonts: next/font bundles locally, no external loading needed
    "font-src 'self'",

    // API connections: backend, RexPay, AWS (Amplify/Rekognition), blockchain RPC
    `connect-src 'self' ${apiOrigin} https://*.globalaccelerex.com https://*.amazonaws.com https://rpc.testnet.arc.network wss://*.walletconnect.com wss://*.walletconnect.org https://*.walletconnect.com`,

    // Iframes: Google Maps embed, RexPay payment
    "frame-src https://www.google.com https://*.globalaccelerex.com",

    // Block this site from being framed (clickjacking protection)
    "frame-ancestors 'none'",

    // Block plugin-based XSS (Flash, Java, etc.)
    "object-src 'none'",

    // Block <base> tag hijacking
    "base-uri 'self'",

    // Block cross-origin form submissions
    "form-action 'self'",

    // Media: webcam for AWS Amplify FaceLiveness
    "media-src 'self' blob:",

    // Workers: self only (Next.js service workers)
    "worker-src 'self' blob:",
  ].join('; ');
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  // Generate a unique nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Build the CSP string
  const csp = buildCsp(nonce);

  // Forward the nonce to Server Components via a custom request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  // Create the response with the modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Choose between enforcing or report-only based on environment + config
  const headerName =
    isProd && !CSP_ENFORCE
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';

  response.headers.set(headerName, csp);
  response.headers.set('x-nonce', nonce);

  return response;
}

// ---------------------------------------------------------------------------
// Matcher: only run middleware on page navigations, not static assets or API
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
