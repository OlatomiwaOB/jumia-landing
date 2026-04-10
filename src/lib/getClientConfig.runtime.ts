// lib/getClientConfig.runtime.ts
export type ClientConfig = {
  id?: string
  domain: string
  name: string
  theme: string
  logo_url?: string
  favicon?: string
  primary_color?: string
  secondary_color?: string
  landingType?: string
  // extend as needed
}

const MOCK: Record<string, ClientConfig> = {
  'abc.localhost': {
    domain: 'abc.localhost',
    name: 'Fortitude',
    theme: 'modern',
    logo_url: '/themes/abc/logo.svg',
    favicon: '/themes/abc/favicon.ico',
    primary_color: '#ff6600',
    secondary_color: '#222222',
    landingType: 'shared',
  },
  'xyz.localhost': {
    domain: 'xyz.localhost',
    name: 'Help2Pay',
    theme: 'classic',
    logo_url: '/themes/xyz/logo.svg',
    favicon: '/themes/xyz/favicon.ico',
    primary_color: '#0066ff',
    secondary_color: '#ffffff',
    landingType: 'shared',
  },
  'default.localhost': {
    domain: 'default.localhost',
    name: 'default',
    theme: 'default',
    logo_url: '/themes/default/logo.svg',
    favicon: '/themes/default/favicon.ico',
    primary_color: '#ffffff',
    secondary_color: '#111111',
    landingType: 'default',
  },
}

const CACHE = new Map<string, ClientConfig | null>()

export async function getClientConfigByDomain(domain: string): Promise<ClientConfig | null> {
  if (CACHE.has(domain)) return CACHE.get(domain) || null

  // Replace this with real DB/API fetch in production:
  // e.g. fetch(`${process.env.CONFIG_API}/clients/${domain}`)
  const data = MOCK[domain] || null
  CACHE.set(domain, data)
  return data
}
