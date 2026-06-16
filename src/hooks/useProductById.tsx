import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { useQuery } from "@tanstack/react-query";

// Step 1: Define what the API response looks like
export interface ProductApiResponse {
    code: string;
    desc: string;
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
    productDto?: any; // Leaving this flexible based on your screenshot
}

// Step 2: Create the custom hook using React Query (just like your other files!)
export const useProductById = (productId: string, entityCode: string) => {
    const { data, isLoading, error } = useQuery<ProductApiResponse>({
        // The query key makes sure we cache the specific product we fetched
        queryKey: ["productById", productId, entityCode],
        // The query function actually calls the endpoint
        queryFn: async () => {
            // Note: we might need to adjust the exact parameter name like "?productId=" or "?id=" based on the API
            const response = await axiosInstanceNoAuth.request({
                method: "GET",
                url: "/products/getById",
                params: {
                    id: productId, // or productId: productId depending on what your boss expects!
                    entityCode: entityCode
                }
            });
            return response.data;
        },
        // Only run this query if we actually have an ID to search for
        enabled: !!productId,
    });

    return {
        productData: data?.productDto || data?.data,
        isLoading,
        error,
    };
};
