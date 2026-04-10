import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCustomer from "@/store/customerStore";
import axiosCustomer from "@/utils/fetch-function-customer";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface Coin {
  id: string | null;
  accountNo: string;
  accountType: string;
  entityCode: string | null;
  symbol: string;
  chain: string;
  username: string | null;
  publicAddress: string;
  name: string;
  label: string | null;
  balance: number;
  usdBalance: number | null;
  lcyBalance: number | null;
  lcyCcy: string | null;
  logo: string;
  status: string | null;
}

interface CurrencySelectorProps {
  value: Coin | null;
  onChange: (coin: Coin) => void;
}

export const CurrencySelector = ({ value, onChange }: CurrencySelectorProps) => {
  const {customer} = useCustomer()
  const { data: balances, isLoading: balancesLoading, error: balancesError } = useQuery({
      queryKey: ['wallet-balances'],
      queryFn: () => axiosCustomer.request({
        method: 'GET',
        url: '/coinwallet/balance',
        params: {
          username: customer?.username,
          entityCode: customer?.entityCode
        }
      })
    })

    const coins: Coin[] = balances?.data?.coins || []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-24 justify-between px-3">
          <div className="flex items-center gap-2">
            {value?.logo && (
              <Image
                src={value.logo}
                alt={value.symbol}
                width={10}
                height={10}
              />
            )}
            <span className="text-sm">{value?.symbol || 'Select'}</span>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-card border border-border shadow-lg">
        {coins?.map((coin: Coin, index: number) => (
          <DropdownMenuItem
            key={`${coin.accountNo}-${index}`}
            onClick={() => onChange(coin)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent"
          >
            <Image
              src={coin?.logo || '/placeholder.svg'}
              alt={coin?.chain}
              width={20}
              height={20}
            />
            
            <div className="flex flex-col">
              <span className="font-medium">{coin.symbol}</span>
              <span className="text-xs text-muted-foreground">
                {coin.chain} • {coin.balance}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};