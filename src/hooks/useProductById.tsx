import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { useQuery } from "@tanstack/react-query";
import { BundleSubItem } from "@/types";

// ─── Shared sub-types ────────────────────────────────────────────────────────

export interface ItemVariant {
    id: number;
    size: string;
    color: string;
    qty: number;
    price: number;
    oldPrice: number;
    vat: number;
}

// ─── Full API response shape ─────────────────────────────────────────────────

export interface ProductApiResponse {
    code: string;
    desc: string;
    /** Flat product data section */
    data: {
        productId: string;
        productName: string;
        productDescription: string;
        productCategory: string;
        productCode: string;
        productPrice: string;
        stockQuantity: number;
        unitQuantity: string;
        imageUrl: string;
        costPrice: string;
        salePrice: string;
        status: string;
        openAmount: string;
        onlineStatus: string;
        onlineDate: string;
        totalSales: number;
        noOfOrders: string;
        weight: number;
        weightUnit: string;
    };
    /** Rich product DTO — preferred for storefront use */
    productDto?: {
        id: number;
        storeCode: string;
        storeName: string;
        picture: string;
        code: string;
        category: string;
        topCategory: string;
        name: string;
        description: string;
        qtyInStore: number;
        costPrice: number;
        salePrice: number;
        oldPrice: number;
        ccy: string;
        pictureList: string[];
        color: string;
        itemSize: string;
        model: string;
        barCode: string;
        expiryDate: string;
        unit: string;
        brand: string;
        banner: boolean;
        featured: boolean;
        onSale: boolean;
        discount: string;
        vat: number;
        usdPrice: number;
        storeLocationCountry: string;
        storeLocationCity: string;
        weight: string;
        weightUnit: string;
        itemVariants?: ItemVariant[];
        /** Present when the product category is BUNDLE */
        bundleSubItems?: BundleSubItem[];
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProductById = (productId: string, entityCode: string) => {
    const { data, isLoading, error } = useQuery<ProductApiResponse>({
        queryKey: ["productById", productId, entityCode],
        queryFn: async () => {
            const response = await axiosInstanceNoAuth.request({
                method: "GET",
                url: "/products/getById",
                params: {
                    id: productId,
                    entityCode: entityCode,
                },
            });
            return response.data;
        },
        enabled: !!productId,
    });

    return {
        productData: data?.productDto || data?.data,
        /** Full typed productDto (preferred — includes bundleSubItems, itemVariants) */
        productDto: data?.productDto,
        isLoading,
        error,
    };
};
