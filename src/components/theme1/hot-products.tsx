import { Button } from "@/components/ui/button";
import headphones from '@/assets/28328_vinia_headphone-removebg-preview.png'
import camera from '@/assets/33427_fujifilm_camera-removebg-preview.png'


const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#f7f7f7] rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow shadow-md">
            <img 
              src={headphones?.src} 
              alt="CLJ Studio Headphones" 
              className="h-48 w-auto object-contain mb-6 transition-transform hover:scale-105"
            />
            <p className="text-sm text-muted-foreground mb-2">Over-Ear</p>
            <h3 className="text-2xl font-bold mb-4">CLJ Studio</h3>
            <Button variant="outline">SHOP NOW</Button>
          </div>
          
          <div className="bg-primary text-primary-foreground rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <img 
              src={camera?.src} 
              alt="Aestex Laptop" 
              className="h-48 w-auto object-contain mb-6 transition-transform hover:scale-105"
            />
            <p className="text-sm text-muted-foreground mb-2">MacBook Air 13" & 15"</p>
            <h3 className="text-2xl font-bold mb-4">Aestex</h3>
            <Button variant="secondary">SHOP NOW</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
