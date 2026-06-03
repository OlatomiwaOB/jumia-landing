"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

interface Store {
  id: number;
  entityCode: string;
  code: string;
  storeName: string;
}

interface StoreComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  axiosInstance: AxiosInstance;
  merchantCode?: string;
  error?: string;
}

export function StoreCombobox({
  value,
  onChange,
  axiosInstance,
  merchantCode = '',
  error,
}: StoreComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchStores = async ({ pageParam = 1 }) => {
    // if (!merchantCode) return { data: [], totalRecords: 0 };
    const res = await axiosInstance.request({
      url: '/store/merchant',
      method: 'GET',
      params: {
        merchantCode,
        pageNumber: pageParam,
        pageSize: 20,
      }
    });
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['stores-infinite'],
    queryFn: fetchStores,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedRecords = allPages.reduce((acc, page) => acc + (page.data?.length || 0), 0);
      if (loadedRecords < (lastPage.totalRecords || 0)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    // enabled: !!merchantCode,
  });

  const stores: Store[] = data?.pages.flatMap((page) => page.data || []) || [];

  const filteredStores = stores.filter(store =>
    store.storeName?.toLowerCase().includes(search.toLowerCase())
  );

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const selectedStore = stores.find((store) => store.code === value || store.id.toString() === value);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between font-normal", error && "border-red-500")}
          // disabled={!merchantCode}
          >
            {selectedStore ? (
              <div className="flex items-center truncate">
                <StoreIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{selectedStore.storeName}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select a store...</span>
            )}
            {isFetching && !stores.length ? (
              <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] lg:w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search store name..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[250px] overflow-y-auto">
              {filteredStores.length === 0 && !isFetching && (
                <CommandEmpty>No store found.</CommandEmpty>
              )}
              <CommandGroup>
                {filteredStores.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.storeName}
                    onSelect={() => {
                      onChange(store.code);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === store.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{store.storeName}</span>
                      <span className="text-xs text-muted-foreground">{store.code}</span>
                    </div>
                  </CommandItem>
                ))}
                {hasNextPage && (
                  <div ref={observerTarget} className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
