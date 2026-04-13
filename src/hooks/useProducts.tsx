import axiosInstanceNoAuth from "@/utils/fetch-function-auth";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (
    storeCode: string,
    entityCode: string,
    category?: string,
    name?: string,
    retryProducts?: any,
    pageNumber: number = 1,
    pageSize: number = 200
) =>{
      const { data,isLoading, error } = useQuery({
      queryKey: [
        "products",
        storeCode,
        entityCode,
        category,
        name,
        retryProducts,
        pageNumber,
        pageSize
      ],
      queryFn: () => {
        return axiosInstanceNoAuth.request({
          method: "GET",
          url: '/ecommerce/products/list',
          params: {
            name,
            storeCode,
            entityCode: entityCode,
            category,
            tag: '',
            pageNumber,
            pageSize
          }
        })
        .then(response => response.data)
      },
      enabled: Boolean(entityCode)
    });

    return {data, isLoading, error}
}
