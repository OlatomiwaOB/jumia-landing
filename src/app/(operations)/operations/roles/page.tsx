'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Search, Filter, Plus, Eye, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import DynamicTable from '@/components/Operations/billers/dynamic-table';
import { Badge } from '@/components/ui/badge';
import CreateRoleModal from '@/components/Operations/roles/create-role';
import RoleViewModal from '@/components/Operations/roles/role-details';
import RoleEditModal from '@/components/Operations/roles/edit-role';
import { usePermission } from '@/hooks/usePermission';

interface Role {
    id: number;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
    createdDate?: string;
    permissionCodes?: string[];
}

const getStatusColor = (status: string): string => {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
    if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
};

export default function RolesPage() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('MANAGE_ROLES', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to manage roles"
    // });

    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [codeFilter, setCodeFilter] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const pageSize = 10;

    const {
        data: apiData,
        isLoading: loading,
        error,
        refetch: refetchRoles
    } = useQuery({
        queryKey: ['roles', page, nameFilter, codeFilter],
        queryFn: () =>
            axiosOperations.request({
                method: 'GET',
                url: '/role/getRoles',
                params: {
                    pageNumber: page,
                    pageSize: pageSize,
                    name: nameFilter || undefined,
                    code: codeFilter || undefined,
                },
            }).then(res => res.data),
    });

    const rolesData: Role[] = apiData || [];

    const normalizedRoles = rolesData.map(role => ({
        ...role,
        status: role.status === 'Active' ? 'ACTIVE' :
            role.status === 'Inactive' ? 'INACTIVE' :
                role.status
    }));

    const filteredRoles = normalizedRoles.filter((role: Role) => {
        const matchesName = nameFilter ? role.roleName.toLowerCase().includes(nameFilter.toLowerCase()) : true;
        const matchesCode = codeFilter ? role.roleCode.toLowerCase().includes(codeFilter.toLowerCase()) : true;
        return matchesName && matchesCode;
    });

    const totalCount = filteredRoles.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const currentPageData = filteredRoles.slice((page - 1) * pageSize, page * pageSize);

    const handleRefresh = () => {
        setIsRefreshing(true);
        refetchRoles().finally(() => setIsRefreshing(false));
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleClearFilters = () => {
        setNameFilter('');
        setCodeFilter('');
        setPage(1);
    };

    const handleView = (record: Role) => {
        setSelectedRole(record);
        setViewModalOpen(true);
    };

    const handleEdit = (record: Role) => {
        setSelectedRole(record);
        setEditModalOpen(true);
    };

    const columns: any[] = [
        {
            title: 'S/N',
            dataIndex: 'id',
            key: 'sn',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <span className="text-accent-foreground">{(page - 1) * pageSize + index + 1}</span>
            ),
        },
        {
            title: 'Role Code',
            dataIndex: 'roleCode',
            key: 'roleCode',
            width: 150,
            render: (code: string) => (
                <span className="font-mono text-accent-foreground">{code || 'N/A'}</span>
            ),
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 200,
            render: (name: string) => (
                <span className="text-accent-foreground">{name || 'N/A'}</span>
            ),
        },
        {
            title: 'Permission Codes',
            dataIndex: 'permissionCodes',
            key: 'permissionCodes',
            width: 300,
            render: (codes: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {codes?.slice(0, 3).map((code, idx) => (
                        <Badge key={idx} className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                            {code}
                        </Badge>
                    ))}
                    {codes && codes.length > 3 && (
                        <Badge className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                            +{codes.length - 3} more
                        </Badge>
                    )}
                </div>
            ),
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     width: 100,
        //     render: (status: string) => (
        //         <Badge className={`${getStatusColor(status)} text-xs px-2 py-1 whitespace-nowrap`}>
        //             {status || 'ACTIVE'}
        //         </Badge>
        //     ),
        // },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: Role) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleView(record)}
                        title="View Details"
                    >
                        <Eye className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-accent/10"
                        onClick={() => handleEdit(record)}
                        title="Edit"
                    >
                        <Edit className="w-4 h-4 text-accent-foreground" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                            Role & Permission
                        </h1>
                        <p className="text-accent-foreground/70">
                            Manage user roles and their permissions
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-accent-foreground">{normalizedRoles.length}</p>
                            <p className="text-sm text-accent-foreground/70">Total Roles</p>
                        </div>
                    </div>
                </div>

                <Card className="mb-6 border-accent/20 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-accent-foreground/70" />
                                <span className="text-sm font-medium text-accent-foreground">Filters</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className=""
                            >
                                {showFilters ? 'Hide' : 'Show'}
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs text-accent-foreground/70">Role Name</Label>
                                    <Input
                                        placeholder="Search by role name..."
                                        value={nameFilter}
                                        onChange={(e) => {
                                            setNameFilter(e.target.value);
                                            setPage(1);
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-accent-foreground/70">Role Code</Label>
                                    <Input
                                        placeholder="Search by role code..."
                                        value={codeFilter}
                                        onChange={(e) => {
                                            setCodeFilter(e.target.value);
                                            setPage(1);
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFilters}
                                        className="w-full"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-accent/20 shadow-sm">
                    <CardHeader className="border-b border-accent/10">
                        <div className='flex justify-between'>
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Roles List
                            </CardTitle>
                            <div className='flex gap-2'>
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
                                <Button
                                    onClick={() => setCreateModalOpen(true)}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Role
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {error ? (
                            <div className="p-12 text-center">
                                <p className="text-red-500 mb-2">Error loading roles</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchRoles()}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                                <p className="mt-2 text-accent-foreground/70">Loading roles...</p>
                            </div>
                        ) : currentPageData.length > 0 ? (
                            <>
                                <DynamicTable
                                    columns={columns}
                                    data={currentPageData}
                                    itemsPerPage={pageSize}
                                />

                                {totalPages > 1 && (
                                    <div className="flex justify-end p-4 border-t border-accent/10">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-accent-foreground/70 px-2">
                                                Page {page} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === totalPages}
                                                className="border-accent/20 hover:bg-accent/10"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Search className="h-12 w-12 text-accent-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium text-accent-foreground mb-2">
                                    No roles found
                                </h3>
                                <p className="text-accent-foreground/70 mb-4">
                                    {nameFilter || codeFilter
                                        ? 'No roles match your search criteria'
                                        : 'Get started by creating your first role'}
                                </p>
                                <Button
                                    onClick={() => setCreateModalOpen(true)}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Role
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

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

                <RoleEditModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    role={selectedRole}
                    onSuccess={() => refetchRoles()}
                />
            </div>
        </div>
    );
}