"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import BillerList from "@/components/Operations/billers/billers-lists";
import {
  useFetchBillers,
  useFetchBillerCategories,
} from "@/hooks/useBillPayment";
import { useLocationStore } from "@/store/locationStore";
import type { Biller } from "@/types/bill-payment-types";
import { usePermission } from "@/hooks/usePermission";
import { PermissionButton } from "@/components/Operations/permission/permission-button";
import { useRouter } from "next/navigation";

const Billers = () => {
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('VIEW_BILLERS', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to view billers"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const location = useLocationStore((s) => s.location);
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } =
    useFetchBillerCategories();

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].billerCategoryCode);
    }
  }, [categories, selectedCategory]);

  const { data: billers, isLoading: billersLoading, refetch } = useFetchBillers(
    {
      billerCategory: selectedCategory === "ALL" ? "" : selectedCategory,
      name: searchTerm || undefined,
    },
    location
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const tableData = (billers ?? []).map((b: Biller, index: number) => ({
    id: b.id ?? index + 1,
    billerCode: b.billerCode,
    billerName: b.billerName,
    shortName: b.billerShortName ?? b.billerCode,
    category: b.billerCategory ?? b.billerCategoryCode ?? "—",
    status: b.status ?? "ACTIVE",
    lookupDesc: b.billerDescription,
    billerLogo: b.billerLogo ?? b.logoURL,
  }));

  const filteredData = tableData.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.billerName?.toLowerCase().includes(searchLower) ||
      item.billerCode?.toLowerCase().includes(searchLower) ||
      item.shortName?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
              Billers Management
            </h1>
            <p className="text-accent-foreground/70">
              Manage billers for bill payments and transactions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-accent-foreground">{filteredData.length}</p>
              <p className="text-sm text-accent-foreground/70">Total Billers</p>
            </div>
          </div>
        </div>

        <Card className="border-accent/20 shadow-sm mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-accent-foreground">
                Billers List
              </CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
                  <Input
                    placeholder="Search billers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-accent/20 text-accent-foreground"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48 border-accent/20">
                    <SelectValue
                      placeholder={
                        categoriesLoading ? "Loading…" : "All Categories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {(categories ?? []).map((cat) => (
                      <SelectItem
                        key={cat.billerCategoryCode}
                        value={cat.billerCategoryCode}
                      >
                        {cat.billerCategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <PermissionButton
                  requiredPermissions={['MANAGE_BILLERS']}
                  requireAll={true}
                  hideIfNoPermission={false}
                  tooltipMessage="You do not have permission to manage billers"
                  onClick={() => router.push('/operations/billers/add-biller')}
                >
                  <Plus className="w-4 h-4" />
                  Add Billers
                </PermissionButton>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-accent/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p>
                {''}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-accent/20 hover:bg-accent/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <BillerList
              data={filteredData}
              isFetching={billersLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billers;