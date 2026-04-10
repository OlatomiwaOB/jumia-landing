import placeholder from '@/assets/categories_placeholder.jpg'
import { useCart } from '@/store/cart';
import { ProductProps } from "@/types";
import { Eye,  ShoppingCart} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { QuickViewModal } from '../ui/product-quick-view-modal';


const ProductCard = ({ product }: {product: ProductProps}) => {
    const {addToCart} = useCart()
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all block">
      
      <div className="aspect-square bg-secondary p-6 flex items-center justify-center overflow-hidden relative">
        <img 
          src={product?.picture || placeholder?.src} 
          alt={product?.name} 
          className="h-full w-full object-contain transition-transform group-hover:scale-110"
        />
        
        {/* Quick View Button - appears on hover */}
        <Sheet>
          <SheetTrigger asChild>
            <button
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Quick view"
        >
          <span className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4" />
            Quick View
          </span>
        </button>
          </SheetTrigger>
          <SheetContent className='w-full md:min-w-[600px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle className='sr-only'>{product?.name}</SheetTitle>
            </SheetHeader>
            <QuickViewModal product={product}/>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1 uppercase">{product?.model}</p>
        <h3 className="font-semibold mb-2">{product?.name}</h3>
        <div className="flex items-center justify-center gap-2 mb-3">
          {product?.costPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product?.costPrice.toFixed(2)}
            </span>
          )}
          <span className="font-bold">
            ${product?.salePrice!.toFixed(2)}
          </span>
        </div>
        
        {/* Add to Cart Button */}
        <button className="w-full bg-accent text-primary-foreground py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" onClick={() => addToCart(product as any)}>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;