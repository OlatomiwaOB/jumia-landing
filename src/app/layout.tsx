import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import Providers from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import { LocationProvider } from "@/components/Providers/location-provider";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../../wagmi.config";
import { headers } from "next/headers";
import AlgorandWalletProvider from "./AlgorandWalletProvider";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-display",
  display: "swap",
});

const storefrontConfigs = {
  depot: {
    name: 'Depot',
    favicon: '/favicons/fortitude.ico',
    metadata: {
      title: 'DEPOT | Home',
      description: 'Curated essentials for everyday living.',
    }
  },
  vogue: {
    name: 'Vogue',
    favicon: '/favicons/vogue.ico',
    metadata: {
      title: 'VOGUE | Home',
      description: 'Premium fashion and wearables.',
    }
  },
  'traditional-taste': {
    name: 'Traditional Taste',
    favicon: '/favicons/fortitude.ico',
    metadata: {
      title: 'Traditional Taste | Home',
      description: 'Traditional Taste Home',
    }
  },
};

function getCurrentStorefront() {
  const storefrontKey = process.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof storefrontConfigs;
  return storefrontConfigs[storefrontKey] || storefrontConfigs.depot;
}

export async function generateMetadata(): Promise<Metadata> {
  const storefront = getCurrentStorefront();

  return {
    title: storefront.metadata.title,
    description: storefront.metadata.description,
    icons: {
      icon: storefront.favicon,
      shortcut: storefront.favicon,
      apple: storefront.favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storefront = getCurrentStorefront();
  const accentColor = process.env.NEXT_PUBLIC_ACCENT_COLOR || '0652e9';
  const accentForegroundColor = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR || '76a2fc';

  const headersList = await headers();
  const initialState = cookieToInitialState(
    getConfig(),
    headersList.get("cookie") ?? ""
  );

  return (
    <html lang="en" className={funnelDisplay.variable}>
      <head>
        <meta name="google-site-verification" content="3mJ66FK4ohtkK2BWhKbmiHPwRx4DP6fIXyAJwHi5wPo" />
        <link rel="icon" href={storefront.favicon} type="image/x-icon" />

        <style suppressHydrationWarning>
          {`
          :root {
              --accent-env: #${accentColor};
              --accent-foreground-env: #${accentForegroundColor};
            }
            
            body {
              font-family: var(--font-funnel-display), sans-serif;
            }
          `}
        </style>
      </head>
      <body className="antialiased bg-[#f3f4f6]">
        <Providers initialState={initialState}>
          <AlgorandWalletProvider>
            <LocationProvider autoDetect={true}>
              {children}
              <ScrollToTopButton threshold={300} smooth={true} />
            </LocationProvider>
          </AlgorandWalletProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}