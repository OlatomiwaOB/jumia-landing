import { Metadata } from 'next'
import { clientConfig } from '@/config/client-config'
import ThemeHomepage from '@theme/homepage'

const config = clientConfig()

export const metadata: Metadata = {
  title: config.branding.metadata.title || 'Shop | home',
}

/**
 * Home Page — uses build-time @theme alias.
 * Only the selected storefront's homepage code is bundled.
 */
const HomePage = () => {
  return <ThemeHomepage />;
}

export default HomePage
