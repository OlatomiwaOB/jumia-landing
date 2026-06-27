/**
 * Client Configuration Type Definitions
 * 
 * These types define the shape of per-client configuration that replaces
 * branding-related environment variables. Each client (storefront) has its
 * own configuration file in `src/config/clients/`.
 * 
 * BRANDING DATA lives in JSON files at `src/config/brands/<storefront>.brand.json`.
 * The TypeScript config files import from these JSON files and only add
 * identifiers (env-aware) and feature flags.
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
// Brand JSON Schema (loaded from src/config/brands/*.brand.json)
// ---------------------------------------------------------------------------

/**
 * Colors are a flexible key-value map.
 * Every client MUST have the base colors (accent, accentForeground, etc.)
 * but can add ANY additional colors they need (e.g., textCharcoal).
 * 
 * Example: Traditional Taste has `textCharcoal`, Varisa might add `headerGradientStart`.
 * The JSON schema doesn't restrict which color keys can be added.
 */
export interface BrandColors {
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
  /** Any additional colors the client needs — hex without '#' */
  [key: string]: string;
}

export interface BrandLogos {
  /** Primary logo (used on auth pages, general branding) */
  primary: string;
  /** White variant of the logo */
  white: string;
  /** Full-width white logo (used in sidebars) */
  whiteFull: string;
}

export interface BrandImages {
  /** Banner/splash image (used on auth pages) */
  banner: string;
  /** Favicon path (relative to /public) */
  favicon: string;
}

export interface BrandFont {
  /** Font family identifier, e.g. "roboto", "manrope" */
  family: string;
}

export interface BrandMetadata {
  /** Page title for SEO / browser tab */
  title: string;
  /** Meta description for SEO */
  description: string;
}

export interface BrandApp {
  /** Display name of the client (e.g., "Varisa", "Traditional Taste") */
  clientName: string;
  /** Storefront identifier key — must match the key in clientRegistry */
  storefront: string;
}

/**
 * Shape of the brand JSON files (src/config/brands/*.brand.json).
 * This is what gets imported from the JSON files.
 */
export interface BrandJson {
  app: BrandApp;
  colors: BrandColors;
  logos: BrandLogos;
  images: BrandImages;
  font: BrandFont;
  metadata: BrandMetadata;
}

// ---------------------------------------------------------------------------
// Client Branding (derived from BrandJson for backward compatibility)
// ---------------------------------------------------------------------------

/**
 * @deprecated Use BrandJson directly. This interface exists for backward
 * compatibility with existing code that reads `config.branding.clientName` etc.
 * It flattens the BrandJson structure.
 */
export interface ClientBranding {
  /** Display name of the client (e.g., "Varisa", "Traditional Taste") */
  clientName: string;
  /** Storefront identifier key — must match the key in clientRegistry */
  storefront: string;
  /** Color palette — flexible, can have any number of colors */
  colors: BrandColors;
  /** Logo URLs */
  logos: BrandLogos;
  /** Banner/splash images */
  images: BrandImages;
  /** Font configuration */
  font: BrandFont;
  /** SEO metadata */
  metadata: BrandMetadata;
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

// ---------------------------------------------------------------------------
// Helper: Convert BrandJson to ClientBranding
// ---------------------------------------------------------------------------

/**
 * Converts a BrandJson (from JSON file) to the flat ClientBranding structure
 * used by the existing codebase.
 */
export function brandJsonToBranding(brand: BrandJson): ClientBranding {
  return {
    clientName: brand.app.clientName,
    storefront: brand.app.storefront,
    colors: brand.colors,
    logos: brand.logos,
    images: brand.images,
    font: brand.font,
    metadata: brand.metadata,
  };
}
