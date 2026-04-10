// lib/getClientConfig.server.ts
import { headers } from 'next/headers'
export async function getClientConfigFromHeader() {
  const raw = (await headers()).get('x-client-config')
  return raw ? JSON.parse(raw) : null
}
