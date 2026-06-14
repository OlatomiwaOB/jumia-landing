import { toast } from "sonner";

export type CurrencyCode =
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'NGN'
  | 'INR'
  | 'CNY'
  | 'ZAR'
  | 'GHS';

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  NGN: "₦",
  INR: "₹",
  CNY: "¥",
  ZAR: "R",
  GHS: "₵" // Ghana Cedis
};

export function formatPrice(amount: number, currencyCode: CurrencyCode): string {
  const symbol = currencySymbols[currencyCode] || "₦";

  // Safe fallback if amount is null/undefined
  const safeAmount = Number(amount) || 0;
  const roundedAmount = parseFloat(safeAmount.toFixed(2));

  const formattedAmount = roundedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formattedAmount}`;
}

export const fileUrlFormatted = (fileUrl: string): string => `/${fileUrl.split('/').pop()}` || ''

export const fileUrlFormattedForEdit = (fileUrl: string): string => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;
  if (fileUrl.startsWith('/')) return fileUrl;
  return `/${fileUrl.split('/').pop() || fileUrl}`;
};

export function generateRandomNumber(length: number) {
  if (length <= 0) throw new Error("Length must be greater than 0");
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get current date formatted as dd-mm-yy
 * @returns {string}
 */
export function getCurrentDate() {
  // Return a default date for SSR, real date on client
  if (typeof window === 'undefined') {
    return '01-01-24'; // Default fallback for SSR
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

// console.log(getCurrentDate());

export function timestampToDays(timestamp: number) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // 86,400,000 ms
  return timestamp / millisecondsPerDay;
}

export const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    "active": "bg-green-500 text-white",
    "verified": "bg-green-500 text-white",
    "completed": "bg-green-500 text-white",
    "pending": "bg-yellow-500 text-white",
    "suspended": "bg-red-500 text-white",
    "rejected": "bg-red-500 text-white",
    "failed": "bg-red-500 text-white",
    "n": "bg-red-500 text-white",
    "y": "bg-green-500 text-white",
    "success": "bg-green-500 text-white"
  };

  // console.log(status);


  return variants[status?.toLowerCase()] || "bg-gray-500 text-gray-400";
};

export const formatDateToDDMMYYYY = (date?: Date | string): string => {
  const dateObj = date ? new Date(date) : new Date();

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  // Get day, month, and full year
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();

  return `${day}-${month}-${year}`;
};



export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast('Copied to clipboard')
};

export const randomNDigitNumber = (digits = 20) => {
  if (digits < 1) {
    throw new Error('Number of digits must be at least 1');
  }
  
  if (digits > 15) {
    // For large numbers, use string manipulation to avoid precision issues
    let result = '';
    for (let i = 0; i < digits; i++) {
      if (i === 0) {
        // First digit should be 1-9 to ensure we get the exact number of digits
        result += Math.floor(Math.random() * 9) + 1;
      } else {
        result += Math.floor(Math.random() * 10);
      }
    }
    return result;
  }
  
  // For smaller numbers, use the mathematical approach
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export function getCustomVariantPrices(productName: string, defaultBasePrice: number) {
  if (!productName) return { price2L: defaultBasePrice, price4L: defaultBasePrice * 2 };
  
  const name = productName.toLowerCase();
  
  const customPrices = [
    { keywords: ['seafood rice'], price2L: 50, price4L: 90 },
    { keywords: ['seafood okro'], price2L: 70, price4L: 130 },
    { keywords: ['edikaikong'], price2L: 70, price4L: 130 },
    { keywords: ['native soup', 'native rice', 'ph.native', 'ph native'], price2L: 70, price4L: 130 },
    { keywords: ['ayamashe', 'ofada'], price2L: 75, price4L: 140 },
    { keywords: ['ofeakwu', 'banga'], price2L: 50, price4L: 90 },
    { keywords: ['ukwa'], price2L: 50, price4L: 90 },
    { keywords: ['coconut rice'], price2L: 60, price4L: 110 },
    { keywords: ['pineapple rice'], price2L: 60, price4L: 110 }
  ];

  for (const rule of customPrices) {
    if (rule.keywords.some(k => name.includes(k))) {
      return { price2L: rule.price2L, price4L: rule.price4L };
    }
  }

  return { price2L: defaultBasePrice, price4L: defaultBasePrice * 2 };
}
