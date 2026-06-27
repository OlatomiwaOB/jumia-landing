import { ClientConfig, ClientBranding, ClientIdentifiers, ClientFeatureFlags, EnvironmentAwareValue, BrandJson } from './client-config.types';
import { clientRegistry } from './clients';

// ---------------------------------------------------------------------------
// Environment-aware value resolution
// ---------------------------------------------------------------------------

/**
 * Resolves an environment-aware value based on the current NODE_ENV.
 * Returns the `production` value when NODE_ENV === 'production',
 * otherwise returns the `development` value.
 */
export function resolveEnvValue(value: EnvironmentAwareValue): string {
  return process.env.NODE_ENV === 'production' ? value.production : value.development;
}

// ---------------------------------------------------------------------------
// Config accessor
// ---------------------------------------------------------------------------

/**
 * Get the current client configuration.
 * 
 * Reads `NEXT_PUBLIC_STORE_FRONT` from env to select which client config to use.
 * This is the ONLY place in the entire codebase that reads the storefront env var.
 * 
 * @throws Error if the storefront value is unknown (not in clientRegistry)
 */
export function getClientConfig(): ClientConfig {
  const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;

  if (!storefront) {
    console.warn('[ClientConfig] NEXT_PUBLIC_STORE_FRONT is not set, falling back to "depot"');
    return clientRegistry['depot'];
  }

  const config = clientRegistry[storefront];
  if (!config) {
    throw new Error(
      `[ClientConfig] Unknown storefront "${storefront}". ` +
      `Available: ${Object.keys(clientRegistry).join(', ')}`
    );
  }

  return config;
}

// ---------------------------------------------------------------------------
// Cached singleton
// ---------------------------------------------------------------------------

/**
 * Pre-computed singleton for performance.
 * 
 * Safe because Next.js bakes `NEXT_PUBLIC_*` env vars at build time,
 * so the storefront value never changes at runtime.
 */
let _cachedConfig: ClientConfig | null = null;

export function clientConfig(): ClientConfig {
  if (!_cachedConfig) {
    _cachedConfig = getClientConfig();
  }
  return _cachedConfig;
}

// ---------------------------------------------------------------------------
// Convenience accessors
// ---------------------------------------------------------------------------

/** Get the branding section of the current client config */
export const getClientBranding = (): ClientBranding => clientConfig().branding;

/** Get the identifiers section with environment-aware resolution */
export const getClientIdentifiers = (): { entityCode: string; storeCode: string } => {
  const ids = clientConfig().identifiers;
  return {
    entityCode: resolveEnvValue(ids.entityCode),
    storeCode: resolveEnvValue(ids.storeCode),
  };
};

/** Get the feature flags section of the current client config */
export const getClientFeatures = (): ClientFeatureFlags => clientConfig().features;
