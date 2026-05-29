// 'use client'
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
// import { useRouter, useParams } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { usePermission } from '@/hooks/usePermission';

// export default function ViewMessagingTemplatePage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage message templates"
//   });
//   const router = useRouter();
//   const params = useParams();
//   const templateId = params.id;

//   const { data: templateData, isLoading } = useQuery({
//     queryKey: ['template-detail', templateId],
//     queryFn: () => axiosOperations.request({
//       method: 'GET',
//       url: 'messagingTemplate/getMessageTemplateById',
//       params: {
//         id: templateId
//       }
//     }),
//     enabled: !!templateId,
//   });

//   const getMsgTypeIcon = (msgType: string) => {
//     return msgType === 'email' ? <Mail className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />;
//   };

//   const getMsgTypeColor = (msgType: string): string => {
//     switch (msgType?.toUpperCase()) {
//       case 'EMAIL':
//         return 'bg-blue-500 text-white';
//       case 'SMS':
//         return 'bg-green-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading template...</p>
//         </div>
//       </div>
//     );
//   }

//   const template = templateData?.data?.messageTemplate;

//   if (!template) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500">Template not found</p>
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="mt-4"
//           >
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const parseHTML = (htmlString: string) => {
//     if (!htmlString) return null;

//     if (template.msgType === 'sms') {
//       return (
//         <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg font-mono text-sm">
//           {htmlString}
//         </div>
//       );
//     }

//     return (
//       <div
//         className="prose max-w-none"
//         dangerouslySetInnerHTML={{ __html: htmlString }}
//       />
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="container mx-auto p-6">
//         <div className="flex items-center mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Templates
//           </Button>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <Card className="border-gray-200 shadow-sm">
//             <CardContent className="p-0">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
//                     <div className="flex items-center gap-4 mt-2">
//                       <div className="flex items-center gap-2">
//                         {getMsgTypeIcon(template.msgType)}
//                         <Badge className={getMsgTypeColor(template.msgType)}>
//                           {template.msgType.toUpperCase()}
//                         </Badge>
//                       </div>
//                       <span className="text-sm text-gray-500">Code: {template.templateCode}</span>
//                       <span className="text-sm text-gray-500">ID: {template.id}</span>
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     onClick={() => router.push(`/operations/message-templates/edit/${template.id}`)}
//                   >
//                     Edit Template
//                   </Button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Template Message</h3>
//                   {parseHTML(template.templateMsg)}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { PermissionButton } from '@/components/Operations/permission/permission-button';
import { EditIcon } from '@/components/icons/icons';

const getMsgTypeColor = (msgType: string): string => {
    switch (msgType?.toUpperCase()) {
        case 'EMAIL': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'SMS': return 'bg-green-100 text-green-700 border-green-200';
        case 'PUSH': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getMsgTypeIcon = (msgType: string) => {
    return msgType?.toUpperCase() === 'EMAIL' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
};

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-0.5">
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-sm font-semibold text-dark-gray">{value || 'N/A'}</p>
    </div>
);

export default function ViewMessagingTemplatePage() {
    usePageMetadata('Message Templates', 'View template details.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage message templates"
    });

    const router = useRouter();
    const params = useParams();
    const templateId = params.id;

    const { data: templateData, isLoading } = useQuery({
        queryKey: ['template-detail', templateId],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'messagingTemplate/getMessageTemplateById',
            params: { id: templateId }
        }),
        enabled: !!templateId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    const template = templateData?.data?.messageTemplate;

    if (!template) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-dark-gray font-semibold">Template not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const parseHTML = (htmlString: string) => {
        if (!htmlString) return null;
        if (template.msgType?.toUpperCase() === 'SMS') {
            return (
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg font-mono text-sm text-dark-gray">
                    {htmlString}
                </div>
            );
        }
        return (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl">
                <div className="mb-4">
                    <Button variant="link" onClick={() => router.push('/operations/message-templates')}>
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </div>

                <div className='container mx-auto px-20 py-6'>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-md lg:text-lg font-medium text-dark-gray">{template.title}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge className={`text-xs px-3 py-0.5 border font-medium rounded-full flex items-center gap-1.5 ${getMsgTypeColor(template.msgType)}`}>
                                        {getMsgTypeIcon(template.msgType)}{template.msgType?.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm text-medium-gray font-mono">{template.templateCode}</span>
                                    <span className="text-sm text-medium-gray">ID: {template.id}</span>
                                </div>
                            </div>
                            <PermissionButton
                                requiredPermissions={['MANAGE_MESSAGE_TEMPLATES']}
                                requireAll={true} hideIfNoPermission={false}
                                tooltipMessage="No permission to edit"
                                onClick={() => router.push(`/operations/message-templates/create?edit=true&id=${template.id}`)}
                                className="gap-2"
                            >
                                <EditIcon className="w-4 h-4" /> Edit Template
                            </PermissionButton>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-dark-gray mb-3">Template Message</h3>
                            {parseHTML(template.templateMsg)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}