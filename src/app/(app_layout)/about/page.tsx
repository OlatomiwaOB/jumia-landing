import { Metadata } from 'next'
import { clientConfig } from '@/config/client-config'
import ThemeAbout from '@theme/about'

const config = clientConfig()

export const metadata: Metadata = {
  title: `${config.branding.clientName} | About`,
}

/**
 * About Page — uses build-time @theme alias.
 * Themes without an about page export a "Coming soon" stub.
 */
const AboutPage = () => {
  return <ThemeAbout />;
}

export default AboutPage
