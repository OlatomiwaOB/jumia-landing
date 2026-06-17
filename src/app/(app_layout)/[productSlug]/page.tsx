import DepotThemeProductPage from '@themes/depot/components/utils/product-page';
import VogueThemeProductPage from '@themes/vogue/components/utils/vogue-product-page';
import TraditionalTasteThemeProductPage from '@themes/traditional-taste-v2/components/utils/product-page';
import VarisaThemeProductPage from '@themes/varisa/components/ui/product-page';

export default function ProductSlugPage() {
  const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;

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
