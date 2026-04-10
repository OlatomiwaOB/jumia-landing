'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Truck, Package } from 'lucide-react';
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp"
import { Order } from './dynamic-table';

interface MobileOrderCardProps {
  order: Order;
  onTrackOrder: (order: Order) => void;
  onUpdateTracking: (order: Order) => void;
}

interface CartItem {
  itemCode: string;
  itemName: string;
  price: number;
  unit: string | null;
  quantity: number;
  discount: number;
  amount: number;
  picture: string;
}

const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-500 text-white';

  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'paid':
      return 'bg-green-500 text-white';
    case 'processing':
    case 'pending':
      return 'bg-blue-500 text-white';
    case 'shipped':
      return 'bg-orange-500 text-white';
    case 'cancelled':
    case 'failed':
    case 'draft':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  if (!status) return null;

  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'paid':
      return <Eye className="w-3 h-3" />;
    case 'processing':
    case 'pending':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
    case 'failed':
    case 'draft':
      return <Package className="w-3 h-3" />;
    default:
      return null;
  }
};

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const MobileOrderCard: React.FC<MobileOrderCardProps> = ({
  order,
  onTrackOrder,
  onUpdateTracking
}) => {

  const firstItem = order.cartItems && order.cartItems.length > 0 ? order.cartItems[0] : null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{getDisplayValue(order.cartId)}</p>
          <p className="text-xs text-gray-500">{getDisplayValue(order.orderDate)}</p>
        </div>
        <Badge className={`${getStatusColor(order.orderStatus)} text-xs px-2 py-1 flex items-center gap-1`}>
          {getStatusIcon(order.orderStatus)}
          {getDisplayValue(order.orderStatus)}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative rounded-md overflow-hidden">
          {firstItem ? (
            <Image
              src={firstItem.picture || placeholder.src}
              alt={firstItem.itemName || 'Product image'}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholder.src;
              }}
            />
          ) : (
            <Image
              src={placeholder.src}
              alt="No product image"
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {firstItem ? getDisplayValue(firstItem.itemName) : 'No items in cart'}
          </p>
          <p className="text-xs text-gray-500">
            {order.cartItems?.length || 0} item{(order.cartItems?.length || 0) !== 1 ? 's' : ''} • {order.ccy || 'NGN'} {order.totalAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {order.customerName ? order.customerName.split(' ').map((n: string) => n[0]).join('') : 'GC'}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-600">{getDisplayValue(order.customerName)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onTrackOrder(order)}
            title="Track Order"
          >
            <Truck className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onUpdateTracking(order)}
            title="Update Tracking"
          >
            <Package className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOrderCard;