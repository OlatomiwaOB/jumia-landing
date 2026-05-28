// 'use client'
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Copy, CheckCircle } from 'lucide-react';
// import { useState } from 'react';
// import { toast } from 'sonner';

// interface Role {
//     id: number;
//     roleCode: string;
//     roleName: string;
//     roleDescription: string;
//     status: string;
//     permissionCodes?: string[];
// }

// interface RoleViewModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     role: Role | null;
// }

// const getStatusColor = (status: string): string => {
//     const statusUpper = status?.toUpperCase() || '';
//     if (statusUpper === 'ACTIVE') return 'bg-accent text-white';
//     if (statusUpper === 'INACTIVE') return 'bg-red-500 text-white';
//     return 'bg-gray-500 text-white';
// };

// const InfoRow = ({ label, value, copyable = false }: { label: string; value: string | number | null; copyable?: boolean }) => {
//     const [copied, setCopied] = useState(false);
//     const displayValue = value?.toString() || 'N/A';

//     const handleCopy = () => {
//         if (displayValue === 'N/A') return;
//         navigator.clipboard.writeText(displayValue);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//         toast.success('Copied to clipboard');
//     };

//     return (
//         <div className="flex justify-between items-start py-2 border-b border-accent/10 last:border-0">
//             <span className="text-sm text-accent-foreground/70">{label}</span>
//             <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-accent-foreground text-right">
//                     {displayValue}
//                 </span>
//                 {copyable && displayValue !== 'N/A' && (
//                     <button
//                         onClick={handleCopy}
//                         className="text-accent hover:text-accent/70 transition-colors"
//                         title="Copy to clipboard"
//                     >
//                         {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default function RoleViewModal({ open, onOpenChange, role }: RoleViewModalProps) {
//     if (!role) return null;

//     const permissions = role.permissionCodes || [];

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle className="text-accent-foreground flex items-center gap-4 justify-between">
//                         <span>Role Details</span>
//                         {/* <Badge className={`${getStatusColor(role.status)} text-xs px-2 py-1`}>
//                             {role.status || 'UNKNOWN'}
//                         </Badge> */}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="py-4">
//                     <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Role Code</p>
//                             <p className="text-md font-semibold text-accent-foreground font-mono">
//                                 {role.roleCode}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-accent-foreground/70">Role Name</p>
//                             <p className="text-md font-semibold text-accent-foreground">
//                                 {role.roleName}
//                             </p>
//                         </div>
//                     </div>

//                     {role.roleDescription && (
//                         <div className="mb-6">
//                             <h3 className="text-sm font-semibold text-accent-foreground mb-2">Description</h3>
//                             <p className="text-sm text-accent-foreground/80 p-3 bg-accent/5 rounded-lg border border-accent/20">
//                                 {role.roleDescription}
//                             </p>
//                         </div>
//                     )}

//                     <div>
//                         <h3 className="text-sm font-semibold text-accent-foreground mb-3">
//                             Permissions ({permissions.length})
//                         </h3>
//                         <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-3 bg-accent/5 rounded-lg border border-accent/20">
//                             {permissions.length > 0 ? (
//                                 permissions.map((code, idx) => (
//                                     <Badge key={idx} className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
//                                         {code}
//                                     </Badge>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-accent-foreground/50">No permissions assigned</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }

'use client'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Role {
    id: number;
    roleCode: string;
    roleName: string;
    roleDescription: string;
    status: string;
    permissionCodes?: string[];
}

interface RoleViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
}

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-sm font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export default function RoleViewModal({ open, onOpenChange, role }: RoleViewModalProps) {
    if (!role) return null;

    const permissions = role.permissionCodes || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[100vh] overflow-y-auto rounded-2xl border-0 shadow-xl bg-[#F5F5F5] p-0 gap-0"
                style={{ scrollbarWidth: 'none', scrollbarColor: 'transparent' }}>
                <DialogTitle className="sr-only">Role Details</DialogTitle>

                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-base font-semibold text-dark-gray mb-4">Role Details</h2>

                    <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Field label="Role Code" value={role.roleCode} />
                            <Field label="Role Name" value={role.roleName} />
                            <div className="col-span-2">
                                <Field label="Description" value={role.roleDescription} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-sm font-semibold text-dark-gray">Permissions <span className='text-[#9200C7]'>({permissions.length})</span></p>
                        </div>
                        {permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {permissions.map((code, idx) => (
                                    <Badge key={idx} className="text-xs px-3 py-1 bg-[#E9CCF4] text-[#9200C7] border border-gray-200 rounded-full">
                                        {code}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-medium-gray">No permissions assigned</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}