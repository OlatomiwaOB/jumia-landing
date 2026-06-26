import DepotThemeProductPage from '@themes/depot/components/utils/product-page';
import VogueThemeProductPage from '@themes/vogue/components/utils/vogue-product-page';
import TraditionalTasteThemeProductPage from '@themes/traditional-taste-v2/components/utils/product-page';
import VarisaThemeProductPage from '@themes/varisa/components/ui/product-page';
import { clientConfig } from '@/config/client-config';

export default function ProductSlugPage() {
  const storefront = clientConfig().branding.storefront;

  if (storefront === 'vogue') {
    return <VogueThemeProductPage />;
  }

  if (storefront === 'traditional-taste-v2') {
    return <TraditionalTasteThemeProductPage />;
  }

  if (storefront === 'varisa') {
    return <VarisaThemeProductPage />;
  }

  return <DepotThemeProductPage />;
}
