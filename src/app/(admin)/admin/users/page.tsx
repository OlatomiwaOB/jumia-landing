'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Plus, Search, Eye, Phone, Mail, User, Edit, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/usePermissionBusiness';

interface Staff {
    staffUserId: number;
    staffName: string;
    staffRole: string;
    staffPhone: string;
    staffEmail: string;
    staffStatus: string;
    staffUsername: string;
    photoLink: string;
}

interface UserInfo {
    id: number;
    firstname: string;
    middlename: string | null;
    lastname: string;
    username: string;
    email: string;
    mobileNo: string;
    userRole: string;
    status: string;
    fullname: string;
    merchantCode: string;
    storeCode: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: Staff, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-500 text-white';

    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-500 text-white';
        case 'INACTIVE':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA';
    const names = fullName.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const lastInitial = names[names.length - 1]?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 5,
    onViewDetails,
    onEditDetails
}: {
    columns: Column[];
    data: Staff[];
    itemsPerPage?: number;
    onViewDetails: (staff: Staff) => void;
    onEditDetails: (staff: Staff) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handleViewDetails = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
        onViewDetails(staff);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const columnsWithHandler = columns.map(col => {
        if (col.key === 'actions') {
            return {
                ...col,
                render: (text: string, record: Staff) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => onEditDetails(record)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    </div>
                )
            };
        }
        return col;
    });

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            {columnsWithHandler.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left p-3 font-bold text-sm text-gray-700"
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.staffUserId}
                                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm">
                                        {column.render
                                            ? column.render(item[column.dataIndex as keyof Staff], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof Staff])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Users
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs"
                    >
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0 text-xs"
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-xs"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected user
                        </DialogDescription>
                    </DialogHeader>

                    {selectedStaff && (
                        <div className="py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={selectedStaff.photoLink} alt={getInitials(selectedStaff.staffName)} />
                                    <AvatarFallback className="text-lg">
                                        {getInitials(selectedStaff.staffName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {getDisplayValue(selectedStaff.staffName)}
                                    </h3>
                                    <p className="text-sm text-gray-500">@{getDisplayValue(selectedStaff.staffUsername)}</p>
                                    <Badge className={`${getStatusColor(selectedStaff.staffStatus)} text-xs px-2 py-1 mt-1 w-fit`}>
                                        {getDisplayValue(selectedStaff.staffStatus)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Username:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.staffUsername)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">User Role:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.staffRole)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={`${getStatusColor(selectedStaff.staffStatus)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedStaff.staffStatus)}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">User ID:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.staffUserId)}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStaff.staffPhone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStaff.staffPhone)}</p>
                                        </div>
                                    )}
                                    {selectedStaff.staffEmail && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStaff.staffEmail)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const MobileStaffCard = ({ staff, onViewDetails }: { staff: Staff; onViewDetails: (staff: Staff) => void }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={staff.photoLink} alt={getInitials(staff.staffName)} />
                        <AvatarFallback>
                            {getInitials(staff.staffName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {getDisplayValue(staff.staffName)}
                        </p>
                        <p className="text-xs text-gray-500">@{getDisplayValue(staff.staffUsername)}</p>
                    </div>
                </div>
                <Badge className={`${getStatusColor(staff.staffStatus)} text-xs px-2 py-1`}>
                    {getDisplayValue(staff.staffStatus)}
                </Badge>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{getDisplayValue(staff.staffRole)}</span>
            </div>

            {staff.staffPhone && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{getDisplayValue(staff.staffPhone)}</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Staff ID</p>
                    <p className="text-sm font-medium">{getDisplayValue(staff.staffUserId)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => onViewDetails(staff)}
                >
                    <Eye className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

// Link Staff Modal Component
const LinkStaffModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { user } = useUser();
    const [selectedUsername, setSelectedUsername] = useState('');
    const [comment, setComment] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    // Fetch available users for linking
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['available-users'],
        queryFn: () => axiosInstance.request({
            url: 'https://corestack.app/mmcp/api/v1/usermanager/getUserMasterList',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 10,
                name: '',
                role: '',
                mobileNo: ''
            }
        }),
        enabled: isOpen
    });

    const users: UserInfo[] = usersData?.data?.userInfoList || [];

    const linkStaffMutation = useMutation({
        mutationFn: (linkData: any) =>
            axiosInstance.post('/usermanager/linkstaffstore', linkData),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success('Staff linked successfully');
                onClose();
                setSelectedUsername('');
                setComment('');
                setSelectedUser(null);
            } else {
                toast.error(data?.data?.desc || 'Failed to link staff');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to link staff');
        }
    });

    const handleUsernameChange = (username: string) => {
        setSelectedUsername(username);
        const user = users.find(u => u.username === username);
        setSelectedUser(user || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUsername) {
            toast.error('Please select a username');
            return;
        }

        const payload = {
            username: selectedUsername,
            storeCode: user?.storeCode || '',
            merchantCode: user?.merchantCode || '',
            merchantGroupCode: user?.merchantGroupCode || '',
            entityCode: user?.entityCode || '',
            comment: comment
        };

        linkStaffMutation.mutate(payload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Link Existing User</DialogTitle>
                    <DialogDescription>
                        Link an existing user to your store
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Select value={selectedUsername} onValueChange={handleUsernameChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select username" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingUsers ? (
                                    <SelectItem value="loading" disabled>
                                        Loading users...
                                    </SelectItem>
                                ) : users.length === 0 ? (
                                    <SelectItem value="no-users" disabled>
                                        No users found
                                    </SelectItem>
                                ) : (
                                    users.map((user) => (
                                        <SelectItem key={user.id} value={user.username}>
                                            {user.username} - {user.fullname}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Select an existing user to link to your store
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            value={selectedUser?.fullname || ''}
                            disabled
                            placeholder="Full name will appear here when a user is selected"
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment (Optional)</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add any comments about this staff linkage..."
                            rows={3}
                        />
                    </div>

                    {selectedUser && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-blue-900">Selected User Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                                <div>
                                    <span className="font-medium">Email:</span>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span>
                                    <p>{selectedUser.mobileNo}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Role:</span>
                                    <p>{selectedUser.userRole}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span>
                                    <p>{selectedUser.status}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={linkStaffMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={linkStaffMutation.isPending || !selectedUsername}
                            className="gap-2"
                        >
                            <LinkIcon className="w-4 h-4" />
                            {linkStaffMutation.isPending ? 'Linking...' : 'Link Staff'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function StaffsPage() {
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('MANAGE_USERS', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage users"
    });
    
    const { user } = useUser();
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['staffs-list'],
        queryFn: () => axiosInstance.request({
            url: '/store/all-staffs',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 10,
                storeCode: user?.storeCode,
                entityCode: user?.entityCode || '',
            }
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);


    // Updated to match the actual API response structure
    const staffs: Staff[] = data?.data?.staffList || [];

    // Safe filtering with null checks
    const filteredStaffs = staffs.filter(staff => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (staff.staffName?.toLowerCase() || '').includes(searchLower) ||
            (staff.staffUsername?.toLowerCase() || '').includes(searchLower) ||
            (staff.staffEmail?.toLowerCase() || '').includes(searchLower) ||
            (staff.staffPhone?.toLowerCase() || '').includes(searchLower) ||
            (staff.staffRole?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleViewDetails = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsDetailsModalOpen(true);
    };

    const handleEditDetails = (staff: Staff) => {
        // You might need to adjust this based on your actual edit flow
        router.push(`/admin/users/create-users?edit=true&id=${staff.staffUsername}`);
    };

    const handleOpenLinkModal = () => {
        setIsLinkModalOpen(true);
    };

    const handleCloseLinkModal = () => {
        setIsLinkModalOpen(false);
    };

    const columns: Column[] = [
        {
            title: 'Staff',
            dataIndex: 'staffName',
            key: 'staff',
            width: 200,
            render: (text: string, record: Staff) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={record.photoLink} alt={getInitials(record.staffName)} />
                        <AvatarFallback>
                            {getInitials(record.staffName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {getDisplayValue(record.staffName)}
                        </p>
                        <p className="text-xs text-gray-500">@{getDisplayValue(record.staffUsername)}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'staffEmail',
            key: 'email',
            width: 200,
            render: (text: string) => (
                <p className="text-sm">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'staffPhone',
            key: 'phone',
            width: 150,
            render: (text: string) => (
                <p className="text-sm">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'staffRole',
            key: 'role',
            width: 150,
            render: (text: string) => (
                <p className="text-sm font-medium">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'staffStatus',
            key: 'status',
            width: 100,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: (text: string, record: Staff) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleEditDetails(record)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                User Management
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage your users
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{staffs.length}</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/admin/users/create-users" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add User
                                </Button>
                            </Link>
                            {/* <Button
                                onClick={handleOpenLinkModal}
                                variant="outline"
                                className="gap-2"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Link User
                            </Button> */}
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    User List
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">Loading users...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-red-500">Error loading users</p>
                                </div>
                            ) : staffs.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-gray-500">No users found</p>
                                    <div className="flex gap-2">
                                        <Link href="/admin/users/create-users">
                                            <Button className="gap-2">
                                                <Plus className="w-4 h-4" />
                                                Add User
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={handleOpenLinkModal}
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Link User
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredStaffs.map((staff) => (
                                            <MobileStaffCard
                                                key={staff.staffUserId}
                                                staff={staff}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredStaffs}
                                            onViewDetails={handleViewDetails}
                                            onEditDetails={handleEditDetails}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Link Staff Modal */}
            <LinkStaffModal
                isOpen={isLinkModalOpen}
                onClose={handleCloseLinkModal}
            />
        </div>
    );
}