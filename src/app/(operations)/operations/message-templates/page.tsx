// 'use client'
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Search, Plus } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import Link from 'next/link';
// import TemplateList from '@/components/Operations/message-templates/template-list';
// import { usePermission } from '@/hooks/usePermission';

// export default function MessagingTemplatesPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage message templates"
//     });
//     const [page, setPage] = useState(1);
//     const [searchTerm, setSearchTerm] = useState('');

//     const { data: response, isFetching, isError, refetch } = useQuery({
//         queryKey: ['template-lists', page],
//         queryFn: () => axiosOperations.request({
//             method: 'GET',
//             url: 'messagingTemplate/getMessageTemplates',
//             params: {
//                 pageNumber: page,
//                 pageSize: 50,
//             }
//         }),
//     });

//     const templates = response?.data || [];

//     const paginatorInfo = {
//         currentPage: page,
//         firstPageUrl: '',
//         from: 1,
//         lastPage: response?.data?.totalPages || 1,
//         lastPageUrl: '',
//         links: [],
//         nextPageUrl: null,
//         path: '',
//         perPage: 10,
//         prevPageUrl: null,
//         to: 10,
//         total: response?.data?.totalCount || 0,
//         hasMorePages: (response?.data?.totalPages || 0) > page,
//     };

//     const handlePagination = (current: number) => {
//         setPage(current);
//     };

//     const filteredTemplates = templates?.filter((template: any) => {
//         const searchLower = searchTerm.toLowerCase();
//         return (
//             (template.templateCode?.toLowerCase() || '').includes(searchLower) ||
//             (template.title?.toLowerCase() || '').includes(searchLower) ||
//             (template.msgType?.toLowerCase() || '').includes(searchLower)
//         );
//     });

//     if (isError) {
//         return (
//             <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-red-500">Error loading message templates</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-subtle">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-foreground mb-2">
//                                 Messaging Templates
//                             </h1>
//                             <p className="text-muted-foreground">
//                                 Manage email and SMS templates
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-2xl font-bold text-foreground">{templates.length || 0}</p>
//                         <p className="text-sm text-muted-foreground">Total Templates</p>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div className="relative flex-1 max-w-sm w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                                 placeholder="Search templates..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10"
//                             />
//                         </div>

//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                             <Link href="/operations/message-templates/create" className="w-full sm:w-auto">
//                                 <Button className="w-full sm:w-auto gap-2">
//                                     <Plus className="w-4 h-4" />
//                                     Create Template
//                                 </Button>
//                             </Link>
//                         </div>
//                     </div>

//                     <Card className="border-gray-200 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="text-lg font-semibold text-gray-900">
//                                     Template List
//                                 </CardTitle>
//                                 {/* <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
//                                     Refresh
//                                 </Button> */}
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetch()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Refresh
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <TemplateList
//                                 isFetching={isFetching}
//                                 data={filteredTemplates}
//                                 paginatorInfo={paginatorInfo}
//                             />
//                         </CardContent>
//                     </Card>

//                     {paginatorInfo.total > 0 && (
//                         <div className="flex justify-end">
//                             <div className="flex items-center gap-2">
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handlePagination(page - 1)}
//                                     disabled={page === 1}
//                                 >
//                                     Previous
//                                 </Button>
//                                 {Array.from({ length: Math.min(5, paginatorInfo.lastPage) }, (_, i) => i + 1).map((pageNum) => (
//                                     <Button
//                                         key={pageNum}
//                                         variant={page === pageNum ? "default" : "outline"}
//                                         size="sm"
//                                         onClick={() => handlePagination(pageNum)}
//                                         className="w-8 h-8 p-0"
//                                     >
//                                         {pageNum}
//                                     </Button>
//                                 ))}
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handlePagination(page + 1)}
//                                     disabled={page === paginatorInfo.lastPage}
//                                 >
//                                     Next
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client'
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, ChevronLeft, ChevronRight, Mail, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Template {
    id: number;
    templateCode: string;
    title: string;
    msgType: string;
    templateMsg: string;
    entityCode: string;
}

const getMsgTypeColor = (msgType: string): string => {
    switch (msgType?.toUpperCase()) {
        // case 'EMAIL': return 'bg-blue-100 text-blue-700 border-blue-200';
        // case 'SMS': return 'bg-green-100 text-green-700 border-green-200';
        // case 'PUSH': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-[#FFEACC] text-medium-gray font-semibold';
    }
};

const getDisplayValue = (value: any): string => value?.toString() || 'N/A';

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const result: (number | '...')[] = [];
        if (current <= 3) result.push(1, 2, 3, '...', pages);
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages);
        else result.push(1, '...', current, '...', pages);
        return result;
    };

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Templates per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default function MessagingTemplatesPage() {
    usePageMetadata('Message Templates', 'Manage email and SMS templates.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage message templates"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data: response, isFetching, isError, refetch } = useQuery({
        queryKey: ['template-lists'],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'messagingTemplate/getMessageTemplates',
            params: { pageNumber: 1, pageSize: 1000 }
        }),
    });

    const templates: Template[] = response?.data || [];

    const filtered = useMemo(() => {
        return templates.filter((t) => {
            const s = searchTerm.toLowerCase().trim();
            return !s || (
                t.title?.toLowerCase().includes(s) ||
                t.templateCode?.toLowerCase().includes(s) ||
                t.msgType?.toLowerCase().includes(s)
            );
        });
    }, [templates, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (template: Template) => {
        router.push(`/operations/message-templates/${template.id}`);
    };

    const handleEdit = (template: Template) => {
        router.push(`/operations/message-templates/create?edit=true&id=${template.id}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((t) => ({
            'Title': t.title,
            'Code': t.templateCode,
            'Type': t.msgType,
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `templates-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid gap-4 mt-3">
                <div className="mb-2">
                    <h2 className="text-md font-semibold text-dark-gray">Templates <span className="text-md text-faded-accent">({filtered.length.toLocaleString()})</span></h2>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search templates..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {searchTerm && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        {/* <SeperatorIcon /> */}
                        {/* <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button onClick={() => refetch()} size="lg" variant="outline">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-2.2-5.9M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Button> */}
                        <PermissionButton
                            requiredPermissions={['MANAGE_MESSAGE_TEMPLATES']}
                            requireAll={true} hideIfNoPermission={false}
                            tooltipMessage="No permission to create"
                            onClick={() => router.push('/operations/message-templates/create')}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Create Template
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading templates</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No templates found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['S/N', 'Title', 'Code', 'Type', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((t, idx) => (
                                                <tr key={t.id}
                                                    onClick={() => handleView(t)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-semibold text-dark-gray">{getDisplayValue(t.title)}</p></td>
                                                    <td className="px-3 py-3.5"><p className="text-sm font-mono text-dark-gray">{getDisplayValue(t.templateCode)}</p></td>
                                                    <td className="px-3 py-3.5">
                                                        <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium flex items-center gap-1 w-fit ${getMsgTypeColor(t.msgType)}`}>
                                                            {t.msgType}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action" onClick={() => handleView(t)} title="View"><Eye className="w-4 h-4" /></Button>
                                                            <PermissionButton requiredPermissions={['MANAGE_MESSAGE_TEMPLATES']} requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission" onClick={() => handleEdit(t)} size="xs" variant="action">
                                                                <EditIcon className="w-4 h-4" />
                                                            </PermissionButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {Math.ceil(filtered.length / ITEMS_PER_PAGE) > 1 && (
                                    <TablePagination current={currentPage} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setCurrentPage} />
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:hidden space-y-3 py-2">
                        {filtered.map((t) => (
                            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" onClick={() => handleView(t)}>
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                                        {(t.msgType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dark-gray truncate">{t.title}</p>
                                        <p className="text-xs text-medium-gray mt-0.5 font-mono">{t.templateCode}</p>
                                    </div>
                                    <Badge className={`text-[10px] px-2 py-0.5 border font-medium ${getMsgTypeColor(t.msgType)}`}>{t.msgType}</Badge>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-xs text-medium-gray">Template #{t.id}</p>
                                    <PermissionButton requiredPermissions={['MANAGE_MESSAGE_TEMPLATES']} requireAll={true} hideIfNoPermission={false}
                                        tooltipMessage="No permission" onClick={() => handleEdit(t)} size="xs" variant="action">
                                        <EditIcon className="w-4 h-4" />
                                    </PermissionButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}