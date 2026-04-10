import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div>
            <h3 className="font-bold text-lg mb-4">INFORMATION</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Warranty</a></li>
            </ul>
            <div className="mt-6">
              <p className="font-bold mb-2">📞 555-555-1000</p>
              <p className="text-xs">Mon-Fri: 9:00 AM - 6:00 PM EST</p>
              <p className="text-xs">support@help2pay.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">NEWSLETTER SIGNUP</h3>
            <p className="text-sm mb-4">Get exclusive deals and updates</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-primary-foreground text-primary"
              />
              <Button variant="secondary">→</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© 2024 HELP2PAY. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
