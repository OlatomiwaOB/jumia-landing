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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = clientConfig();
  const { colors, images, storefront } = config.branding;
  const headersList = await headers();
  const initialState = cookieToInitialState(
    getConfig(),
    headersList.get("cookie") ?? ""
  );

  return (
    <html lang="en" className={manropeFont.variable}>
      <head>
        <meta name="google-site-verification" content="3mJ66FK4ohtkK2BWhKbmiHPwRx4DP6fIXyAJwDnuhM_fUBA" />
        <link rel="icon" href={images.favicon} type="image/x-icon" />

        <style suppressHydrationWarning>
          {`
          :root {
              --accent-env: #${colors.accent};
              --accent-foreground-env: #${colors.accentForeground};
              --accent-color2: #${colors.accentColor2};
              --accent-color3: #${colors.accentColor3};
              --dashboard-sidebar-color: #${colors.dashboardSidebar};
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
        {storefront === 'varisa' && <ScrollToTop />}
        <Toaster />
      </body>
    </html>
  );
}