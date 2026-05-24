import DepotThemeProductPage from '@themes/depot/components/utils/product-page';
import VogueThemeProductPage from '@themes/vogue/components/utils/vogue-product-page';
import TraditionalTasteThemeProductPage from '@themes/traditional-taste/components/utils/product-page';

export default function ProductSlugPage() {
  const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'vogue') {
    return <VogueThemeProductPage />;
  }

  if (storefront === 'traditional-taste') {
    return <TraditionalTasteThemeProductPage />;
  }

  return <DepotThemeProductPage />;
}
