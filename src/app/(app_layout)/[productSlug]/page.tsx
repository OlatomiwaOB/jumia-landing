import { ThemeProductPage } from '@theme/exports'

/**
 * Product Page — uses build-time @theme alias.
 * Only the selected storefront's product page is bundled.
 */
export default function ProductSlugPage() {
  return <ThemeProductPage />;
}
