import type { Metadata } from "next";
import { Funnel_Display, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import { LocationProvider } from "@/components/Providers/location-provider";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../../wagmi.config";
import { headers } from "next/headers";
import AlgorandWalletProvider from "./AlgorandWalletProvider";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { clientConfig } from "@/config/client-config";
import { getNonce } from "@/lib/nonce";


const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-display",
  display: "swap",
});

const manropeFont = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { branding } = clientConfig();

  return {
    title: branding.metadata.title,
    description: branding.metadata.description,
    icons: {
      icon: branding.images.favicon,
      shortcut: branding.images.favicon,
      apple: branding.images.favicon,
    },
  };
}

/**
 * Converts a camelCase color key to a CSS variable name.
 * e.g. "accentForeground" → "--accent-foreground-env"
 *      "dashboardSidebar" → "--dashboard-sidebar-color"
 *      "textCharcoal" → "--text-charcoal"
 */
function colorKeyToCssVar(key: string): string {
  // Handle known legacy variable names for backward compatibility
  const legacyMap: Record<string, string> = {
    accent: '--accent-env',
    accentForeground: '--accent-foreground-env',
    accentColor2: '--accent-color2',
    accentColor3: '--accent-color3',
    dashboardSidebar: '--dashboard-sidebar-color',
  };

  if (legacyMap[key]) return legacyMap[key];

  // Convert camelCase to kebab-case for new/custom colors
  return '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = clientConfig();
  const { colors, images } = config.branding;
  const headersList = await headers();
  const initialState = cookieToInitialState(
    getConfig(),
    headersList.get("cookie") ?? ""
  );

  // CSP nonce — generated per-request in middleware.ts
  const nonce = await getNonce();

  // Generate CSS variables from ALL colors in the brand config.
  // Any color key added to the brand JSON automatically becomes a CSS variable.
  const colorVars = Object.entries(colors)
    .map(([key, value]) => `${colorKeyToCssVar(key)}: #${value};`)
    .join('\n              ');

  return (
    <html lang="en" className={manropeFont.variable}>
      <head>
        <meta name="google-site-verification" content="3mJ66FK4ohtkK2BWhKbmiHPwRx4DP6fIXyAJwDnuhM_fUBA" />
        <link rel="icon" href={images.favicon} type="image/x-icon" />

        <style nonce={nonce}>
          {`
          :root {
              ${colorVars}
            }
            
            body {
              font-family: var(--font-manrope), sans-serif;
            }
          `}
        </style>
      </head>
      <body className="antialiased bg-[#f3f4f6]">
        <Providers initialState={initialState}>
          <AlgorandWalletProvider>
            <LocationProvider autoDetect={true}>
              {children}

            </LocationProvider>
          </AlgorandWalletProvider>
        </Providers>
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  );
}