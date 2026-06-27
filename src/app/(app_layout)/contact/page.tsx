import { Metadata } from 'next'
import { clientConfig } from '@/config/client-config'
import ThemeContact from '@theme/contact'

const config = clientConfig()

export const metadata: Metadata = {
  title: `${config.branding.clientName} | Contact`,
}

/**
 * Contact Page — uses build-time @theme alias.
 */
const ContactPage = () => {
  return <ThemeContact />;
}

export default ContactPage
