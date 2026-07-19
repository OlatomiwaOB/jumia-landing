import { headers } from 'next/headers';

/**
 * Retrieve the CSP nonce for the current request.
 *
 * The nonce is generated in `middleware.ts` and forwarded via the
 * `x-nonce` request header. Use this in Server Components to attach
 * the nonce to inline `<script>` or `<style>` tags.
 *
 * @returns The base64-encoded nonce string, or empty string if unavailable.
 *
 * @example
 * ```tsx
 * import { getNonce } from '@/lib/nonce';
 *
 * export default async function Layout({ children }) {
 *   const nonce = await getNonce();
 *   return <style nonce={nonce}>{`...`}</style>;
 * }
 * ```
 */
export async function getNonce(): Promise<string> {
  return (await headers()).get('x-nonce') ?? '';
}
