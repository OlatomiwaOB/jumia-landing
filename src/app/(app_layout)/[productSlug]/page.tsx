import DepotThemeProductPage from '@themes/depot/components/utils/product-page';
import VogueThemeProductPage from '@themes/vogue/components/utils/vogue-product-page';

export default function ProductSlugPage() {
  const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'vogue') {
    return <VogueThemeProductPage />;
  }

  return <DepotThemeProductPage />;
}
