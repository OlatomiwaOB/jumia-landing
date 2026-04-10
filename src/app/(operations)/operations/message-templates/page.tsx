'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import Link from 'next/link';
import TemplateList from '@/components/Operations/message-templates/template-list';
import { usePermission } from '@/hooks/usePermission';

export default function MessagingTemplatesPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage message templates"
    });
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: response, isFetching, isError, refetch } = useQuery({
        queryKey: ['template-lists', page],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'messagingTemplate/getMessageTemplates',
            params: {
                pageNumber: page,
                pageSize: 50,
            }
        }),
    });

    const templates = response?.data || [];

    const paginatorInfo = {
        currentPage: page,
        firstPageUrl: '',
        from: 1,
        lastPage: response?.data?.totalPages || 1,
        lastPageUrl: '',
        links: [],
        nextPageUrl: null,
        path: '',
        perPage: 10,
        prevPageUrl: null,
        to: 10,
        total: response?.data?.totalCount || 0,
        hasMorePages: (response?.data?.totalPages || 0) > page,
    };

    const handlePagination = (current: number) => {
        setPage(current);
    };

    const filteredTemplates = templates?.filter((template: any) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (template.templateCode?.toLowerCase() || '').includes(searchLower) ||
            (template.title?.toLowerCase() || '').includes(searchLower) ||
            (template.msgType?.toLowerCase() || '').includes(searchLower)
        );
    });

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error loading message templates</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Messaging Templates
                            </h1>
                            <p className="text-muted-foreground">
                                Manage email and SMS templates
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{templates.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Templates</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/operations/message-templates/create" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Template
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Template List
                                </CardTitle>
                                {/* <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                    Refresh
                                </Button> */}
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
                            <TemplateList
                                isFetching={isFetching}
                                data={filteredTemplates}
                                paginatorInfo={paginatorInfo}
                            />
                        </CardContent>
                    </Card>

                    {paginatorInfo.total > 0 && (
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePagination(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                {Array.from({ length: Math.min(5, paginatorInfo.lastPage) }, (_, i) => i + 1).map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePagination(pageNum)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePagination(page + 1)}
                                    disabled={page === paginatorInfo.lastPage}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}