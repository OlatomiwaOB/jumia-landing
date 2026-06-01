'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VarisaProductCard from './product-card';
import { ProductProps } from '@/types';
import { ShoppingBag } from 'lucide-react';

const topDealsData: ProductProps[] = [
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/asun_jollof_deals_1779986321209.png",
        "id": 234,
        "code": "VD-ASUN",
        "category": "Rice Dishes",
        "topCategory": null,
        "name": "Asun Jollof (2L)",
        "description": "Our signature smoky party Jollof Rice topped with incredibly spicy and tender roasted goat meat (Asun). An authentic taste of Nigerian celebrations.",
        "qtyInStore": 10,
        "costPrice": 50.00,
        "salePrice": 65.00,
        "oldPrice": 75.00,
        "ccy": "GBP",
        "pictureList": ["/images/mock/asun_jollof_deals_1779986321209.png"],
        "color": "",
        "itemSize": "2L",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Bowl",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "13%",
        "vat": 0,
        "usdPrice": 82,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "2",
        "weightUnit": "L"
    },
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/nigerian_fried_rice_deals_1779986335732.png",
        "id": 235,
        "code": "VD-FRIEDRICE",
        "category": "Rice Dishes",
        "topCategory": null,
        "name": "Special Fried Rice (2L)",
        "description": "Rich Nigerian Fried Rice loaded with diced chicken, liver, mixed vegetables, and perfectly balanced spices. A colorful and flavorful crowd-pleaser.",
        "qtyInStore": 10,
        "costPrice": 30.00,
        "salePrice": 40.00,
        "oldPrice": 45.00,
        "ccy": "GBP",
        "pictureList": ["/images/mock/nigerian_fried_rice_deals_1779986335732.png"],
        "color": "",
        "itemSize": "2L",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Bowl",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "11%",
        "vat": 0,
        "usdPrice": 51,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "2",
        "weightUnit": "L"
    },
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/yam_porridge_deals_1779986359697.png",
        "id": 236,
        "code": "VD-YAMPORRIDGE",
        "category": "Porridges",
        "topCategory": null,
        "name": "Yam Porridge / Asaro (2L)",
        "description": "Authentic Asaro made with fresh yams cooked until tender in a rich palm oil sauce with crayfish, dry fish, and a touch of spinach. Pure comfort food.",
        "qtyInStore": 10,
        "costPrice": 50.00,
        "salePrice": 65.00,
        "oldPrice": 75.00,
        "ccy": "GBP",
        "pictureList": ["/images/mock/yam_porridge_deals_1779986359697.png"],
        "color": "",
        "itemSize": "2L",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Bowl",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "13%",
        "vat": 0,
        "usdPrice": 82,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "2",
        "weightUnit": "L"
    },
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/gizdodo_deals_1779986373276.png",
        "id": 237,
        "code": "VD-GIZDODO",
        "category": "Sides & Extras",
        "topCategory": null,
        "name": "Spicy Gizdodo (2L)",
        "description": "A sweet and savory Nigerian classic! Fried plantain cubes (Dodo) and tender chicken gizzards tossed in a rich, spicy tomato and pepper sauce.",
        "qtyInStore": 10,
        "costPrice": 50.00,
        "salePrice": 65.00,
        "oldPrice": 70.00,
        "ccy": "GBP",
        "pictureList": ["/images/mock/gizdodo_deals_1779986373276.png"],
        "color": "",
        "itemSize": "2L",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Bowl",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "7%",
        "vat": 0,
        "usdPrice": 82,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "2",
        "weightUnit": "L"
    },
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/peppered_turkey_deals_1779986387792.png",
        "id": 238,
        "code": "VD-TURKEY",
        "category": "Proteins",
        "topCategory": null,
        "name": "Peppered Jumbo Turkey",
        "description": "Succulent jumbo turkey mid-wings, perfectly seasoned, deep-fried until golden, and coated in our signature fiery red pepper sauce. Min 6pcs.",
        "qtyInStore": 10,
        "costPrice": 2.00,
        "salePrice": 3.00,
        "oldPrice": 3.50,
        "ccy": "GBP",
        "pictureList": ["/images/mock/peppered_turkey_deals_1779986387792.png"],
        "color": "",
        "itemSize": "Per Piece",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Piece",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "14%",
        "vat": 0,
        "usdPrice": 3.80,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "",
        "weightUnit": ""
    },
    {
        "storeCode": "STO4122",
        "storeName": "Sheriff Limited",
        "picture": "/images/mock/ofada_sauce_deals_1779986401643.png",
        "id": 239,
        "code": "VD-OFADA",
        "category": "Traditional Soups",
        "topCategory": null,
        "name": "Ofada Sauce / Ayamase (2L)",
        "description": "Premium Ayamase sauce made with bleached palm oil, green peppers, locust beans, and generously loaded with assorted meats and boiled eggs.",
        "qtyInStore": 10,
        "costPrice": 60.00,
        "salePrice": 75.00,
        "oldPrice": 85.00,
        "ccy": "GBP",
        "pictureList": ["/images/mock/ofada_sauce_deals_1779986401643.png"],
        "color": "",
        "itemSize": "2L",
        "model": "",
        "barCode": "",
        "expiryDate": "",
        "unit": "Bowl",
        "brand": "Varisa Catering",
        "banner": true,
        "featured": true,
        "onSale": true,
        "discount": "11%",
        "vat": 0,
        "usdPrice": 95,
        "storeLocationCountry": "UK",
        "storeLocationCity": "London",
        "weight": "2",
        "weightUnit": "L"
    }
];

export default function TopDeals() {
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 7,
        minutes: 50,
        seconds: 47
    });

    // Simple countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    // Display only the first 6 products as per the grid design
    const productsToDisplay = topDealsData.slice(0, 6);

    return (
        <section className="w-full bg-accent-foreground py-16 md:py-24">
            <div className="max-w-[1500px] mx-auto px-4 md:px-8">
                {/* Header section with Title and Timer */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#111]">
                        Top Deals Of The Day
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-[#111] text-sm md:text-base hidden sm:block">Hurry up! Offer ends in:</span>
                        <div className="flex gap-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.days)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.hours)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.minutes)}
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent text-white font-bold text-lg md:text-xl rounded shadow-sm">
                                {formatTime(timeLeft.seconds)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Promotional Banner */}
                    <div className="w-full xl:w-1/3 rounded-2xl overflow-hidden relative min-h-[400px] xl:min-h-auto shadow-lg flex flex-col items-center justify-center text-center p-8 group">
                        {/* Background Image (using a fallback from mock images) */}
                        <div className="absolute inset-0 z-0">
                            <Image 
                                src="/images/mock/jollof_rice.png" 
                                alt="Promotional Banner" 
                                fill 
                                className="object-cover brightness-[0.4] transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        
                        {/* Overlay Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                            <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag size={28} className="text-white" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/80">GREAT DEALS!</h4>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-8 text-center max-w-[90%]">
                                Place Your Orders with Ease<br/>and Let Us Handle the Rest
                            </h3>
                            <Link href="/shop">
                                <button className="bg-white text-[#111] font-bold px-8 py-3.5 rounded-full hover:bg-accent hover:text-white transition-colors duration-300 shadow-md">
                                    Order Now
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full xl:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {productsToDisplay.map((product) => (
                                <VarisaProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
