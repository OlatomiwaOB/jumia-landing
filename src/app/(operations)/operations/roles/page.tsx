// 'use client'
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { RefreshCw, Search, Filter, Plus, Eye, Edit } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import DynamicTable from '@/components/Operations/billers/dynamic-table';
// import { Badge } from '@/components/ui/badge';
// import CreateRoleModal from '@/components/Operations/roles/create-role';
// import RoleViewModal from '@/components/Operations/roles/role-details';
// import RoleEditModal from '@/components/Operations/roles/edit-role';
// import { usePermission } from '@/hooks/usePermission';

// interface Role {
//     id: number;
//     roleCode: string;
//     roleName: string;
//     roleDescription: string;
//     status: string;
//     createdDate?: string;
//     permissionCodes?: string[];
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
//     if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// export default function RolesPage() {
//     const { usePermissionGuard } = usePermission();

//     usePermissionGuard('MANAGE_ROLES', {
//         redirectToNotPermitted: true,
//         toastMessage: "You don't have permission to manage roles"
//     });

//     const [page, setPage] = useState(1);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const [showFilters, setShowFilters] = useState(false);
//     const [nameFilter, setNameFilter] = useState('');
//     const [codeFilter, setCodeFilter] = useState('');
//     const [createModalOpen, setCreateModalOpen] = useState(false);
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//     const pageSize = 10;

//     const {
//         data: apiData,
//         isLoading: loading,
//         error,
//         refetch: refetchRoles
//     } = useQuery({
//         queryKey: ['roles', page, nameFilter, codeFilter],
//         queryFn: () =>
//             axiosOperations.request({
//                 method: 'GET',
//                 url: '/role/getRoles',
//                 params: {
//                     pageNumber: page,
//                     pageSize: pageSize,
//                     name: nameFilter || undefined,
//                     code: codeFilter || undefined,
//                 },
//             }).then(res => res.data),
//     });

//     const rolesData: Role[] = apiData || [];

//     const normalizedRoles = rolesData.map(role => ({
//         ...role,
//         status: role.status === 'Active' ? 'ACTIVE' :
//             role.status === 'Inactive' ? 'INACTIVE' :
//                 role.status
//     }));

//     const filteredRoles = normalizedRoles.filter((role: Role) => {
//         const matchesName = nameFilter ? role.roleName.toLowerCase().includes(nameFilter.toLowerCase()) : true;
//         const matchesCode = codeFilter ? role.roleCode.toLowerCase().includes(codeFilter.toLowerCase()) : true;
//         return matchesName && matchesCode;
//     });

//     const totalCount = filteredRoles.length;
//     const totalPages = Math.ceil(totalCount / pageSize);

//     const currentPageData = filteredRoles.slice((page - 1) * pageSize, page * pageSize);

//     const handleRefresh = () => {
//         setIsRefreshing(true);
//         refetchRoles().finally(() => setIsRefreshing(false));
//     };

//     const handlePageChange = (newPage: number) => {
//         setPage(newPage);
//     };

//     const handleClearFilters = () => {
//         setNameFilter('');
//         setCodeFilter('');
//         setPage(1);
//     };

//     const handleView = (record: Role) => {
//         setSelectedRole(record);
//         setViewModalOpen(true);
//     };

//     const handleEdit = (record: Role) => {
//         setSelectedRole(record);
//         setEditModalOpen(true);
//     };

//     const columns: any[] = [
//         {
//             title: 'S/N',
//             dataIndex: 'id',
//             key: 'sn',
//             width: 80,
//             render: (_: any, __: any, index: number) => (
//                 <span className="text-accent-foreground">{(page - 1) * pageSize + index + 1}</span>
//             ),
//         },
//         {
//             title: 'Role Code',
//             dataIndex: 'roleCode',
//             key: 'roleCode',
//             width: 150,
//             render: (code: string) => (
//                 <span className="font-mono text-accent-foreground">{code || 'N/A'}</span>
//             ),
//         },
//         {
//             title: 'Role Name',
//             dataIndex: 'roleName',
//             key: 'roleName',
//             width: 200,
//             render: (name: string) => (
//                 <span className="text-accent-foreground">{name || 'N/A'}</span>
//             ),
//         },
//         {
//             title: 'Permission Codes',
//             dataIndex: 'permissionCodes',
//             key: 'permissionCodes',
//             width: 300,
//             render: (codes: string[]) => (
//                 <div className="flex flex-wrap gap-1">
//                     {codes?.slice(0, 3).map((code, idx) => (
//                         <Badge key={idx} className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                             {code}
//                         </Badge>
//                     ))}
//                     {codes && codes.length > 3 && (
//                         <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                             +{codes.length - 3} more
//                         </Badge>
//                     )}
//                 </div>
//             ),
//         },
//         // {
//         //     title: 'Status',
//         //     dataIndex: 'status',
//         //     key: 'status',
//         //     width: 100,
//         //     render: (status: string) => (
//         //         <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
//         //             {status || 'ACTIVE'}
//         //         </Badge>
//         //     ),
//         // },
//         {
//             title: 'Actions',
//             key: 'actions',
//             width: 120,
//             render: (_: any, record: Role) => (
//                 <div className="flex items-center gap-1">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleView(record)}
//                         title="View Details"
//                     >
//                         <Eye className="w-4 h-4 text-accent-foreground" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 hover:bg-accent/10"
//                         onClick={() => handleEdit(record)}
//                         title="Edit"
//                     >
//                         <Edit className="w-4 h-4 text-accent-foreground" />
//                     </Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-accent-foreground mb-2">
//                             Role & Permission
//                         </h1>
//                         <p className="text-accent-foreground/70">
//                             Manage user roles and their permissions
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <div className="text-right">
//                             <p className="text-2xl font-bold text-accent-foreground">{normalizedRoles.length}</p>
//                             <p className="text-sm text-accent-foreground/70">Total Roles</p>
//                         </div>
//                     </div>
//                 </div>

//                 <Card className="mb-6 border-accent/20 shadow-sm">
//                     <CardContent className="p-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center gap-2">
//                                 <Filter className="w-4 h-4 text-accent-foreground/70" />
//                                 <span className="text-sm font-medium text-accent-foreground">Filters</span>
//                             </div>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className=""
//                             >
//                                 {showFilters ? 'Hide' : 'Show'}
//                             </Button>
//                         </div>

//                         {showFilters && (
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <Label className="text-xs text-accent-foreground/70">Role Name</Label>
//                                     <Input
//                                         placeholder="Search by role name..."
//                                         value={nameFilter}
//                                         onChange={(e) => {
//                                             setNameFilter(e.target.value);
//                                             setPage(1);
//                                         }}
//                                         className="mt-1"
//                                     />
//                                 </div>
//                                 <div>
//                                     <Label className="text-xs text-accent-foreground/70">Role Code</Label>
//                                     <Input
//                                         placeholder="Search by role code..."
//                                         value={codeFilter}
//                                         onChange={(e) => {
//                                             setCodeFilter(e.target.value);
//                                             setPage(1);
//                                         }}
//                                         className="mt-1"
//                                     />
//                                 </div>
//                                 <div className="flex items-end">
//                                     <Button
//                                         variant="outline"
//                                         onClick={handleClearFilters}
//                                         className="w-full"
//                                     >
//                                         Clear Filters
//                                     </Button>
//                                 </div>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 <Card className="border-accent/20 shadow-sm">
//                     <CardHeader className="border-b border-accent/10">
//                         <div className='flex justify-between'>
//                             <CardTitle className="text-lg font-semibold text-accent-foreground">
//                                 Roles List
//                             </CardTitle>
//                             <div className='flex gap-2'>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={handleRefresh}
//                                     disabled={isRefreshing}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                                     Refresh
//                                 </Button>
//                                 <Button
//                                     onClick={() => setCreateModalOpen(true)}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Create Role
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                         {error ? (
//                             <div className="p-12 text-center">
//                                 <p className="text-red-500 mb-2">Error loading roles</p>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => refetchRoles()}
//                                     className="border-accent/20 hover:bg-accent/10"
//                                 >
//                                     Try Again
//                                 </Button>
//                             </div>
//                         ) : loading ? (
//                             <div className="p-12 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
//                                 <p className="mt-2 text-accent-foreground/70">Loading roles...</p>
//                             </div>
//                         ) : currentPageData.length > 0 ? (
//                             <>
//                                 <DynamicTable
//                                     columns={columns}
//                                     data={currentPageData}
//                                     itemsPerPage={pageSize}
//                                 />

//                                 {totalPages > 1 && (
//                                     <div className="flex justify-end p-4 border-t border-accent/10">
//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => handlePageChange(page - 1)}
//                                                 disabled={page === 1}
//                                                 className="border-accent/20 hover:bg-accent/10"
//                                             >
//                                                 Previous
//                                             </Button>
//                                             <span className="text-sm text-accent-foreground/70 px-2">
//                                                 Page {page} of {totalPages}
//                                             </span>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => handlePageChange(page + 1)}
//                                                 disabled={page === totalPages}
//                                                 className="border-accent/20 hover:bg-accent/10"
//                                             >
//                                                 Next
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <div className="p-12 text-center">
//                                 <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
//                                     <Search className="h-12 w-12 text-accent-foreground/50" />
//                                 </div>
//                                 <h3 className="text-lg font-medium text-accent-foreground mb-2">
//                                     No roles found
//                                 </h3>
//                                 <p className="text-accent-foreground/70 mb-4">
//                                     {nameFilter || codeFilter
//                                         ? 'No roles match your search criteria'
//                                         : 'Get started by creating your first role'}
//                                 </p>
//                                 <Button
//                                     onClick={() => setCreateModalOpen(true)}
//                                     className="bg-accent hover:bg-accent/90 text-white"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Create Role
//                                 </Button>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 <CreateRoleModal
//                     open={createModalOpen}
//                     onOpenChange={setCreateModalOpen}
//                     onSuccess={() => refetchRoles()}
//                 />

//                 <RoleViewModal
//                     open={viewModalOpen}
//                     onOpenChange={setViewModalOpen}
//                     role={selectedRole}
//                 />

//                 <RoleEditModal
//                     open={editModalOpen}
//                     onOpenChange={setEditModalOpen}
//                     role={selectedRole}
//                     onSuccess={() => refetchRoles()}
//                 />
//             </div>
//         </div>
//     );
// }


'use client'
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Badge } from '@/components/ui/badge';
import CreateRoleModal from '@/components/Operations/roles/create-role';
import RoleViewModal from '@/components/Operations/roles/role-details';
import { usePermission } from '@/hooks/usePermission';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { TransInflowIcon, SeperatorIcon, EditIcon } from '@/components/icons/icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Role {
    id: number;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
    createdDate?: string;
    permissionCodes?: string[];
}

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
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Roles per Page</p>
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

export default function RolesPage() {
    usePageMetadata('Role & Permission', 'Manage user roles and their permissions.');
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_ROLES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage roles"
    });

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const ITEMS_PER_PAGE = 10;

    const {
        data: apiData,
        isLoading: loading,
        error,
        refetch: refetchRoles
    } = useQuery({
        queryKey: ['roles'],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/role/getRoles',
                params: {
                    pageNumber: 1,
                    pageSize: 1000,
                },
            }).then(res => res.data),
    });

    const rolesData: Role[] = apiData || [];

    const filtered = useMemo(() => {
        return rolesData.filter((role: Role) => {
            const s = searchTerm.toLowerCase().trim();
            const matchesSearch = !s || (
                role.roleName?.toLowerCase().includes(s) ||
                role.roleCode?.toLowerCase().includes(s) ||
                role.roleDescription?.toLowerCase().includes(s)
            );
            return matchesSearch;
        });
    }, [rolesData, searchTerm]);

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleView = (record: Role) => {
        setSelectedRole(record);
        setViewModalOpen(true);
    };

    const handleEdit = (record: Role) => {
        router.push(`/operations/roles/edit?id=${record.id}`);
    };

    const exportToCSV = () => {
        if (!filtered.length) { toast.error('No data to export'); return; }
        const csv = Papa.unparse(filtered.map((r) => ({
            'Role Code': r.roleCode,
            'Role Name': r.roleName,
            'Description': r.roleDescription,
            'Status': r.status,
            'Permissions': r.permissionCodes?.join(', ') || '',
        })), { header: true });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `roles-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export complete');
    };

    return (
        <div className="min-h-screen px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Roles</p>
                    <p className="text-2xl font-semibold text-dark-gray">{filtered.length.toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Search roles..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {(searchTerm) && (
                            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <PermissionButton
                            requiredPermissions={['MANAGE_ROLES']}
                            requireAll={true}
                            hideIfNoPermission={false}
                            tooltipMessage="You do not have permission to create roles"
                            onClick={() => setCreateModalOpen(true)}
                            size="lg"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Create Role
                        </PermissionButton>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading roles</div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <p className="text-2xl font-medium text-dark-gray">No roles found</p>
                                <p className="text-sm text-medium-gray">Try adjusting your search</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#EEEEEE]">
                                                {['Role Code', 'Role Name', 'Permissions', ''].map((h) => (
                                                    <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((r, idx) => (
                                                <tr key={r.id}
                                                    onClick={() => handleView(r)}
                                                    className={`border-b-2 border-[#EEEEEE] cursor-pointer hover:bg-orange-50/40 transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm font-mono font-medium text-dark-gray">{getDisplayValue(r.roleCode)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <p className="text-sm font-semibold text-dark-gray">{getDisplayValue(r.roleName)}</p>
                                                    </td>
                                                    <td className="px-3 py-3.5">
                                                        <div className="flex flex-wrap gap-1">
                                                            {r.permissionCodes?.slice(0, 3).map((code, i) => (
                                                                <Badge key={i} className="text-[10px] px-2 py-0.5 bg-[#E9CCF4] text-[#9200C7]">
                                                                    {code}
                                                                </Badge>
                                                            ))}
                                                            {r.permissionCodes && r.permissionCodes.length > 3 && (
                                                                <Badge className="text-[10px] px-2 py-0.5 bg-[#E9CCF4] text-[#9200C7] border-gray-200">
                                                                    +{r.permissionCodes.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="xs" variant="action"
                                                                onClick={() => handleView(r)}
                                                                title="View Details">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <PermissionButton
                                                                requiredPermissions={['MANAGE_ROLES']}
                                                                requireAll={true} hideIfNoPermission={false}
                                                                tooltipMessage="No permission to manage roles"
                                                                onClick={() => handleEdit(r)}
                                                                size="xs" variant="action">
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
                                    <TablePagination
                                        current={currentPage} total={filtered.length}
                                        perPage={ITEMS_PER_PAGE} onChange={setCurrentPage}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    <div className="lg:hidden space-y-3 py-2">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                <p className="text-sm font-medium text-dark-gray">No roles found</p>
                            </div>
                        ) : (
                            filtered.map((r) => (
                                <div key={r.id}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                                    onClick={() => handleView(r)}>
                                    <div className="flex items-center gap-3 p-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-sm font-bold text-orange-600">{r.roleName?.charAt(0) || 'R'}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-dark-gray truncate">{r.roleName}</p>
                                            <p className="text-xs text-medium-gray mt-0.5 font-mono">{r.roleCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100"
                                        onClick={(e) => e.stopPropagation()}>
                                        <p className="text-xs text-medium-gray">{r.permissionCodes?.length || 0} permissions</p>
                                        <PermissionButton
                                            requiredPermissions={['MANAGE_ROLES']}
                                            requireAll={true} hideIfNoPermission={false}
                                            tooltipMessage="No permission to manage roles"
                                            onClick={() => handleEdit(r)}
                                            size="xs" variant="action">
                                            <EditIcon className="w-4 h-4" />
                                        </PermissionButton>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            <CreateRoleModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={() => refetchRoles()}
            />

            <RoleViewModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                role={selectedRole}
            />
        </div>
    );
}