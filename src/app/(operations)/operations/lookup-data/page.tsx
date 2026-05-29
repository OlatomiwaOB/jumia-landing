'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import useOperations from '@/store/operationsStore';
import Link from 'next/link';
import LookupList from '@/components/Operations/lookup-data/lookup-list';
import LookupTypeFilter from '@/components/Operations/lookup-data/lookup-filter';
import { any } from 'zod/mini';
import { usePermission } from '@/hooks/usePermission';

export default function LookupDataPage() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('MANAGE_LOOKUP', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage lookup data"
    // });
    const [page, setPage] = useState(1);
    const [visible, setVisible] = useState(false);
    const [applyFilter, setApplyFilter] = useState(false);
    const [categoryCode, setCategoryCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { operations } = useOperations();

    const isFilterActive = categoryCode !== '' || applyFilter;

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['lookup-data', page, applyFilter, categoryCode],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'lookupdata/getallcategorycode',
            params: {
                entityCode: operations?.entityCode,
                categoryCode: categoryCode === 'categoryCode' ? '' : categoryCode || '',
                pageNumber: page,
                pageSize: 10
            }
        }),
        enabled: !!operations?.entityCode,
        select: (response: any) => response.data,
    });

    const filteredLookups = data?.filter((lookup: any) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (lookup.categoryCode?.toLowerCase() || '').includes(searchLower) ||
            (lookup.lookupName?.toLowerCase() || '').includes(searchLower) ||
            (lookup.lookupCode?.toLowerCase() || '').includes(searchLower) ||
            (lookup.LookupDesc?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleSubmit = () => {
        setApplyFilter((prev) => !prev);
        setPage(1);
    };

    const toggleVisible = () => {
        setVisible((v) => !v);
    };

    const handlePagination = (current: number) => {
        setPage(current);
    };

    const handleClearFilters = () => {
        setCategoryCode('');
        setApplyFilter(false);
        setSearchTerm('');
        setPage(1);
    };

    const paginatorInfo = {
        currentPage: page,
        firstPageUrl: '',
        from: 1,
        lastPage: data?.data?.totalPages || 1,
        lastPageUrl: '',
        links: [],
        nextPageUrl: null,
        path: '',
        perPage: 10,
        prevPageUrl: null,
        to: 10,
        total: data?.data?.totalItems || 0,
        hasMorePages: data?.data?.totalPages > page,
    };

    const handleCodeFilter = (value: string) => {
        setCategoryCode(value);
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Lookup Data Management
                            </h1>
                            <p className="text-muted-foreground">
                                Manage and organize your lookup data
                            </p>
                        </div>
                    </div>
                </div>

                <Card className=" shadow-sm mb-6">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1 max-w-sm w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-foreground/70" />
                                    <Input
                                        placeholder="Search lookups..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-accent/20 text-accent-foreground"
                                    />
                                </div>
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSearchTerm('')}
                                        className="whitespace-nowrap"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Link href="/operations/lookup-data/create" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Lookup Data
                                    </Button>
                                </Link>

                                {isFilterActive && (
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFilters}
                                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={toggleVisible}
                                    className="gap-2"
                                >
                                    {visible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    {visible && (
                        <CardContent className="border-t pt-6">
                            <LookupTypeFilter
                                handleApplyFilter={handleSubmit}
                                onCodeFilter={handleCodeFilter}
                            />
                        </CardContent>
                    )}
                </Card>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Lookup list
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className="border-accent/20 hover:bg-accent/10"
                            >
                                Refresh
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isError ? (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-red-500">Error loading lookup data</p>
                            </div>
                        ) : (
                            <LookupList
                                isFetching={isFetching}
                                data={filteredLookups}
                                paginatorInfo={paginatorInfo}
                                onPagination={handlePagination}
                                searchTerm={searchTerm}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}