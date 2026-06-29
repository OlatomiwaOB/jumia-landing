// 'use client';

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Search, Upload, Check, Loader2 } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useUser from "@/store/userStore";
// import { toast } from "sonner";
// import Image from "next/image";
// import placeholder from "@/components/images/placeholder-product.webp";
// import { usePermission } from "@/hooks/usePermissionBusiness";

// interface Product {
//   id: string;
//   name: string;
//   code: string;
//   picture: string;
//   pictureList?: string[];
// }

// interface FileUploadResponse {
//   code: string;
//   desc: string;
//   refNo?: string;
// }

// interface UploadingState {
//   [productCode: string]: boolean;
// }

// const ProductImagesPage = () => {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_INVENTORY', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage inventory"
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [uploadingStates, setUploadingStates] = useState<UploadingState>({});
//   const [successStates, setSuccessStates] = useState<{ [key: string]: boolean }>({});
//   const { user } = useUser();

//   const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["products-for-images"],
//     queryFn: () => {
//       return axiosInstance.request({
//         method: "GET",
//         url: '/ecommerce/products/list',
//         params: {
//           name: '',
//           storeCode: user?.storeCode,
//           entityCode: user?.entityCode,
//           tag: '',
//           pageNumber: 1,
//           pageSize: 1000
//         }
//       }).then(response => response.data);
//     }
//   });

//   const filteredProducts = data?.products?.filter((product: Product) =>
//     product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.code?.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const validateFile = (file: File): string | null => {
//     const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
//     const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

//     if (!validExtensions.includes(fileExtension)) {
//       return 'Please select a valid image file (JPG, PNG, GIF, WEBP)';
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       return 'File size must be less than 10MB';
//     }

//     return null;
//   };

//   const renameFileWithProductCode = (file: File, productCode: string): File => {
//     const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
//     const newFileName = `${productCode}${fileExtension}`;

//     return new File([file], newFileName, {
//       type: file.type,
//       lastModified: file.lastModified,
//     });
//   };

//   const uploadProductImage = async (product: Product, file: File) => {
//     const validationError = validateFile(file);
//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }

//     setUploadingStates(prev => ({ ...prev, [product.code]: true }));
//     setSuccessStates(prev => ({ ...prev, [product.code]: false }));

//     try {
//       const renamedFile = renameFileWithProductCode(file, product.code);

//       const fileUploadFormData = new FormData();
//       fileUploadFormData.append('file', renamedFile);

//       const headers = {
//         'x-source-code': 'WEB',
//         'FileType': 'PRODUCT_IMAGE',
//         'Content-Type': 'multipart/form-data'
//       };

//       const response = await axiosInstance.post<FileUploadResponse>(
//         '/fileuploadservice/uploadfile',
//         fileUploadFormData,
//         {
//           headers,
//           params: {
//             entityCode: user?.entityCode,
//             storeCode: user?.storeCode,
//             FILETYPE: 'PRODUCT_IMAGE',
//             productCode: product.code
//           }
//         }
//       );

//       if (response.data?.code !== '000') {
//         throw new Error(response.data?.desc || 'Image upload failed');
//       }

//       setSuccessStates(prev => ({ ...prev, [product.code]: true }));
//       toast.success(`Image uploaded for ${product.name}`);

//       setTimeout(() => {
//         setSuccessStates(prev => ({ ...prev, [product.code]: false }));
//       }, 3000);

//       refetch();

//     } catch (error: any) {
//       console.error('Upload error:', error);
//       const errorMessage = error.response?.data?.desc || error.message || 'Error uploading image';
//       toast.error(errorMessage);
//     } finally {
//       setUploadingStates(prev => ({ ...prev, [product.code]: false }));
//     }
//   };

//   const handleCardClick = (product: Product) => {
//     if (fileInputRefs.current[product.code] && !uploadingStates[product.code]) {
//       fileInputRefs.current[product.code]?.click();
//     }
//   };

//   const handleFileSelect = (product: Product, e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       uploadProductImage(product, file);
//     }
//     e.target.value = '';
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading products</p>
//           <p className="text-muted-foreground">Please try again later</p>
//           <Button onClick={() => refetch()} className="mt-4">
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Product Images</h1>
//       </div>

//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search by product name or code..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {filteredProducts.map((product: Product) => (
//           <Card
//             key={product.id}
//             className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${uploadingStates[product.code] ? 'opacity-50 pointer-events-none' : ''
//               }`}
//             onClick={() => handleCardClick(product)}
//           >
//             <CardContent className="p-4">
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={el => {
//                   fileInputRefs.current[product.code] = el;
//                 }}
//                 onChange={(e) => handleFileSelect(product, e)}
//                 className="hidden"
//                 disabled={uploadingStates[product.code]}
//               />

//               <div className="relative w-full h-40 bg-muted rounded-lg mb-3 overflow-hidden">
//                 {product.picture ? (
//                   <Image
//                     src={product.picture}
//                     alt={product.name}
//                     fill
//                     className="object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = placeholder.src;
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <span className="text-sm text-gray-400">No Image</span>
//                   </div>
//                 )}

//                 {successStates[product.code] && (
//                   <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
//                     <div className="bg-green-500 text-white rounded-full p-2">
//                       <Check className="h-6 w-6" />
//                     </div>
//                   </div>
//                 )}

//                 {uploadingStates[product.code] && (
//                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                     <Loader2 className="h-8 w-8 text-white animate-spin" />
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-1">
//                 <h3 className="font-medium text-sm line-clamp-2" title={product.name}>
//                   {product.name}
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   Code: {product.code}
//                 </p>
//               </div>

//               <div className="mt-2 text-xs text-center text-muted-foreground">
//                 Click card to upload image
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredProducts.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Search className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No products found</h3>
//           <p className="text-muted-foreground">
//             {searchTerm ? `No products match "${searchTerm}"` : 'No products available'}
//           </p>
//           {searchTerm && (
//             <Button
//               onClick={() => setSearchTerm("")}
//               variant="secondary"
//               className="mt-4"
//             >
//               Clear Search
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductImagesPage;

'use client';

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Check, Loader2, X, ImageIcon, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import { toast } from "sonner";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";
import { usePermission } from "@/hooks/usePermissionBusiness";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SeperatorIcon, TransInflowIcon } from "@/components/icons/icons";
import { useRouter } from "next/navigation";
import { usePageMetadata } from "@/hooks/usePageMetadata";

interface Product {
  id: string;
  name: string;
  code: string;
  picture: string;
  pictureList?: string[];
}

interface FileUploadResponse {
  code: string;
  desc: string;
  refNo?: string;
}

interface UploadingState {
  [productCode: string]: boolean;
}

const ProductImagesPage = () => {
  usePageMetadata('Product Images', 'Upload and manage product images.');
  const { usePermissionGuard } = usePermission();
  usePermissionGuard('MANAGE_INVENTORY', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage inventory"
  });
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [uploadingStates, setUploadingStates] = useState<UploadingState>({});
  const [successStates, setSuccessStates] = useState<{ [key: string]: boolean }>({});
  const { user } = useUser();

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products-for-images"],
    queryFn: () => {
      return axiosInstance.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: user?.storeCode,
          entityCode: user?.entityCode,
          tag: '',
          pageNumber: 1,
          pageSize: 1000
        }
      }).then(response => response.data);
    }
  });

  const filteredProducts = useMemo(() => {
    let products = (data?.products || []) as Product[];

    if (searchTerm) {
      products = products.filter((product: Product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showMissingOnly) {
      products = products.filter((product: Product) => !product.picture);
    }

    return products;
  }, [data?.products, searchTerm, showMissingOnly]);

  const validateFile = (file: File): string | null => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return 'Please select a valid image file (JPG, PNG, GIF, WEBP)';
    }

    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const renameFileWithProductCode = (file: File, productCode: string): File => {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    const newFileName = `${productCode}${fileExtension}`;

    return new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  const uploadProductImage = async (product: Product, file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploadingStates(prev => ({ ...prev, [product.code]: true }));
    setSuccessStates(prev => ({ ...prev, [product.code]: false }));

    try {
      const renamedFile = renameFileWithProductCode(file, product.code);

      const fileUploadFormData = new FormData();
      fileUploadFormData.append('file', renamedFile);

      const headers = {
        'x-source-code': 'WEB',
        'FileType': 'PRODUCT_IMAGE',
        'Content-Type': 'multipart/form-data'
      };

      const response = await axiosInstance.post<FileUploadResponse>(
        '/fileuploadservice/uploadfile',
        fileUploadFormData,
        {
          headers,
          params: {
            entityCode: user?.entityCode,
            storeCode: user?.storeCode,
            FILETYPE: 'PRODUCT_IMAGE',
            productCode: product.code
          }
        }
      );

      if (response.data?.code !== '000') {
        throw new Error(response.data?.desc || 'Image upload failed');
      }

      setSuccessStates(prev => ({ ...prev, [product.code]: true }));
      toast.success(`Image uploaded for ${product.name}`);

      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [product.code]: false }));
      }, 3000);

      refetch();

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.desc || error.message || 'Error uploading image';
      toast.error(errorMessage);
    } finally {
      setUploadingStates(prev => ({ ...prev, [product.code]: false }));
    }
  };

  const handleCardClick = (product: Product) => {
    if (fileInputRefs.current[product.code] && !uploadingStates[product.code]) {
      fileInputRefs.current[product.code]?.click();
    }
  };

  const handleFileSelect = (product: Product, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadProductImage(product, file);
    }
    e.target.value = '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-sidebar-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 text-sm">Error loading products</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2">
      <div className="mb-4 px-2">
        <Button variant="link" onClick={() => router.push('/admin/inventories')}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-sm text-medium-gray mb-1">Total</p>
          <p className="text-2xl font-semibold text-dark-gray">{(data?.products || []).length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-sm text-medium-gray mb-1">With Images</p>
          <p className="text-2xl font-semibold text-dark-gray">
            {(data?.products || []).filter((p: any) => p.picture).length.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-sm text-medium-gray mb-1">Missing Images</p>
          <p className="text-2xl font-semibold text-dark-gray">
            {(data?.products || []).filter((p: any) => !p.picture).length.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or code..."
              className="pl-9 text-medium-gray"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-1.5">
              <Label className="text-xs text-medium-gray cursor-pointer">Missing Images Only</Label>
              <Switch
                checked={showMissingOnly}
                onCheckedChange={setShowMissingOnly}
              />
            </div>

            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="gap-1 text-xs">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product: Product) => (
          <Card
            key={product.id}
            className={`bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-orange-200 ${uploadingStates[product.code] ? 'opacity-50 pointer-events-none' : ''
              }`}
            onClick={() => handleCardClick(product)}
          >
            <CardContent className="p-4">
              <input
                type="file"
                accept="image/*"
                ref={el => { fileInputRefs.current[product.code] = el; }}
                onChange={(e) => handleFileSelect(product, e)}
                className="hidden"
                disabled={uploadingStates[product.code]}
              />

              <div className="relative w-full h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden border border-gray-200">
                {product.picture ? (
                  <Image
                    src={product.picture}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholder.src; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                )}

                {successStates[product.code] && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                )}

                {uploadingStates[product.code] && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}

                {!uploadingStates[product.code] && !successStates[product.code] && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-white/90 rounded-full px-3 py-1.5 text-xs font-medium text-dark-gray shadow-sm flex items-center gap-1.5">
                      <TransInflowIcon className="w-3.5 h-3.5 rotate-180" />
                      {product.picture ? 'Replace Image' : 'Upload Image'}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-sm text-dark-gray line-clamp-2" title={product.name}>
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-medium-gray">Code <span className="bg-gray-100 font-semibold text-[10px] px-2 py-0.5 rounded-2xl border border-gray-200">{product.code}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Search className="w-10 h-10 text-gray-300" />
          <p className="text-2xl font-medium text-dark-gray">No products found</p>
          <p className="text-sm text-medium-gray">
            {searchTerm
              ? `No products match "${searchTerm}"`
              : showMissingOnly
                ? 'All products have images'
                : 'No products available'}
          </p>
          {(searchTerm || showMissingOnly) && (
            <Button onClick={() => { setSearchTerm(""); setShowMissingOnly(false); }} variant="outline">Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImagesPage;