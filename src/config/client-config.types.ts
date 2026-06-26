/**
 * Client Configuration Type Definitions
 * 
 * These types define the shape of per-client configuration that replaces
 * branding-related environment variables. Each client (storefront) has its
 * own configuration file in `src/config/clients/`.
 * 
 * IMPORTANT: The `identifiers` section supports environment-aware values
 * (different values for development vs production). Use the helper functions
 * in `client-config.ts` to resolve the correct value at runtime.
 */

// ---------------------------------------------------------------------------
// Environment-aware value (dev vs prod)
// ---------------------------------------------------------------------------

/**
 * A value that differs between development and production environments.
 * Use `resolveEnvValue()` from `client-config.ts` to get the correct value.
 */
export interface EnvironmentAwareValue {
  /** Value used when NODE_ENV === 'development' */
  development: string;
  /** Value used when NODE_ENV === 'production' */
  production: string;
}

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------

export interface ClientColors {
  /** Primary accent color — hex without '#', e.g. "A0522D" */
  accent: string;
  /** Foreground color on top of accent — hex without '#' */
  accentForeground: string;
  /** Secondary accent color — hex without '#' */
  accentColor2: string;
  /** Tertiary accent color — hex without '#' */
  accentColor3: string;
  /** Dashboard sidebar background color — hex without '#' */
  dashboardSidebar: string;
  /** Text charcoal color — hex without '#' */
  textCharcoal?: string;
}

export interface ClientLogos {
  /** Primary logo (used on auth pages, general branding) */
  primary: string;
  /** White variant of the logo */
  white: string;
  /** Full-width white logo (used in sidebars) */
  whiteFull: string;
}

export interface ClientImages {
  /** Banner/splash image (used on auth pages) */
  banner: string;
  /** Favicon path (relative to /public) */
  favicon: string;
}

export interface ClientFont {
  /** Font family identifier, e.g. "roboto", "manrope" */
  family: string;
}

export interface ClientMetadata {
  /** Page title for SEO / browser tab */
  title: string;
  /** Meta description for SEO */
  description: string;
}

export interface ClientBranding {
  /** Display name of the client (e.g., "Varisa", "Traditional Taste") */
  clientName: string;
  /** Storefront identifier key — must match the key in clientRegistry */
  storefront: string;
  /** Color palette */
  colors: ClientColors;
  /** Logo URLs */
  logos: ClientLogos;
  /** Banner/splash images */
  images: ClientImages;
  /** Font configuration */
  font: ClientFont;
  /** SEO metadata */
  metadata: ClientMetadata;
}

// ---------------------------------------------------------------------------
// Identifiers (environment-aware)
// ---------------------------------------------------------------------------

export interface ClientIdentifiers {
  /** Entity code for API calls (e.g., "H2P", "FTD") — differs per environment */
  entityCode: EnvironmentAwareValue;
  /** Store code for API calls (e.g., "STO7056") — differs per environment */
  storeCode: EnvironmentAwareValue;
}

// ---------------------------------------------------------------------------
// Feature Flags (per-client)
// ---------------------------------------------------------------------------

export interface ClientFeatureFlags {
  /** Whether Buy Now Pay Later features are enabled */
  enableBNPL: boolean;
  /** Whether credit score features are enabled */
  enableCreditScore: boolean;
  /** Whether send-money features are enabled */
  enableSendMoney: boolean;
  /** Whether add-bank-account features are enabled */
  enableAddBankAccount: boolean;
  /** Whether multi-store management is enabled */
  enableStores: boolean;
  /** Whether payment methods management is enabled */
  enablePaymentMethods: boolean;
}

// ---------------------------------------------------------------------------
// Root Config
// ---------------------------------------------------------------------------

export interface ClientConfig {
  branding: ClientBranding;
  identifiers: ClientIdentifiers;
  features: ClientFeatureFlags;
}
