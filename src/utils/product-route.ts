import { ProductProps } from "@/types";
import { getClientIdentifiers } from '@/config/client-config';

const DEFAULT_PRODUCT_SLUG = "product";

const buildStoreAwarePath = (pathname: string, storeCode?: string | null) => {
  const defaultStoreCode = getClientIdentifiers().storeCode;
  const resolvedStoreCode = storeCode?.trim();

  if (!resolvedStoreCode || resolvedStoreCode === defaultStoreCode) {
    return pathname;
  }

  const params = new URLSearchParams({ storeCode: resolvedStoreCode });
  return `${pathname}?${params.toString()}`;
};

export const slugifyProductName = (name?: string | null) => {
  const normalizedName = (name || DEFAULT_PRODUCT_SLUG)
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedName || DEFAULT_PRODUCT_SLUG;
};

export const getProductHref = (product: ProductProps, storeCode?: string | null) => {
  const productSlug = slugifyProductName(product.name);
  return buildStoreAwarePath(`/${productSlug}`, storeCode || product.storeCode);
};

export const getCategoryHref = (categoryCode: string, storeCode?: string | null) =>
  buildStoreAwarePath(`/shop/${encodeURIComponent(categoryCode)}`, storeCode);

export const getProductGallery = (product?: ProductProps | null) => {
  const gallery = [product?.picture, ...(product?.pictureList || [])].filter(
    (image): image is string => Boolean(image)
  );

  return Array.from(new Set(gallery));
};

export const findProductBySlug = (products: ProductProps[], slug: string) =>
  products.find((product) => slugifyProductName(product.name) === slugifyProductName(slug));
