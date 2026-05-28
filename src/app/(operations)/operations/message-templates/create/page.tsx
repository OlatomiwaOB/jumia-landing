// 'use client'
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, Save } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import axiosOperations from '@/utils/fetch-function-op-auth';
// import { useMutation } from '@tanstack/react-query';
// import dynamic from 'next/dynamic';
// import '@uiw/react-md-editor/markdown-editor.css';
// import '@uiw/react-markdown-preview/markdown.css';
// import { usePermission } from '@/hooks/usePermission';

// const MDEditor = dynamic(
//   () => import('@uiw/react-md-editor').then((mod) => mod.default),
//   { ssr: false }
// );

// interface TemplateFormData {
//   title: string;
//   templateCode: string;
//   msgType: string;
// }

// export default function CreateMessagingTemplatePage() {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage message templates"
//   });
//   const router = useRouter();
//   const [editorValue, setEditorValue] = useState('');

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors }
//   } = useForm<TemplateFormData>({
//     defaultValues: {
//       title: '',
//       templateCode: '',
//       msgType: 'EMAIL'
//     }
//   });

//   const createTemplateMutation = useMutation({
//     mutationFn: (formData: any) =>
//       axiosOperations.request({
//         method: 'POST',
//         url: 'messagingTemplate/save',
//         data: formData
//       }),
//     onSuccess: (data) => {
//       if (data?.data?.code === '000') {
//         toast.success('Messaging Template created successfully!');
//         router.push('/operations/message-templates');
//       } else {
//         toast.error(data?.data?.desc || 'Failed to create template');
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Error creating template');
//     }
//   });

//   const onSubmit = (data: TemplateFormData) => {
//     if (!editorValue.trim()) {
//       toast.error('Please enter template message');
//       return;
//     }

//     const payload = {
//       id: 0,
//       entityCode: 'FTD',
//       msgType: data.msgType,
//       title: data.title,
//       templateCode: data.templateCode,
//       templateMsg: editorValue
//     };

//     createTemplateMutation.mutate(payload);
//   };

//   const msgTypeValue = watch('msgType');

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

//         <div className="flex items-center justify-center mb-8">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
//               <Save className="w-8 h-8 text-accent-foreground" />
//             </div>
//             <h1 className="text-3xl font-bold text-accent-foreground">
//               Create Messaging Template
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Create a new email or SMS template
//             </p>
//           </div>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Card className="border-gray-200 shadow-sm mb-6">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-gray-900">
//                   Template Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="msgType">Message Type *</Label>
//                     <Select
//                       value={msgTypeValue}
//                       onValueChange={(value) => setValue('msgType', value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select message type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="EMAIL">Email</SelectItem>
//                         <SelectItem value="SMS">SMS</SelectItem>
//                         <SelectItem value="PUSH">Push</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="templateCode">Template Code *</Label>
//                     <Input
//                       id="templateCode"
//                       {...register('templateCode', { required: 'Template code is required' })}
//                       placeholder="Enter template code"
//                     />
//                     {errors.templateCode && (
//                       <p className="text-sm text-red-500">{errors.templateCode.message}</p>
//                     )}
//                   </div>

//                   <div className="md:col-span-2 space-y-2">
//                     <Label htmlFor="title">Template Title *</Label>
//                     <Input
//                       id="title"
//                       {...register('title', { required: 'Template title is required' })}
//                       placeholder="Enter template title"
//                     />
//                     {errors.title && (
//                       <p className="text-sm text-red-500">{errors.title.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Template Message *</Label>
//                   <MDEditor
//                     value={editorValue}
//                     onChange={(value) => setEditorValue(value || '')}
//                     height={200}
//                     preview="live"
//                   />
//                   {!editorValue.trim() && (
//                     <p className="text-sm text-red-500">Template message is required</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="flex justify-end gap-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={createTemplateMutation.isPending}
//                 className="gap-2"
//               >
//                 <Save className="w-4 h-4" />
//                 {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface TemplateFormData {
    title: string;
    templateCode: string;
    msgType: string;
}

const FormSection = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 mt-1">
                <h2 className="text-sm font-semibold text-dark-gray">{title}</h2>
                <p className="text-xs text-medium-gray mt-1">{subtitle}</p>
            </div>
            <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
            </div>
        </div>
    </div>
);

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
        {children}
    </div>
);

export default function CreateMessagingTemplatePage() {
    usePageMetadata('Message Templates', 'Create or edit messaging templates.');
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to manage message templates"
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [editorValue, setEditorValue] = useState('');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TemplateFormData>({
        defaultValues: { title: '', templateCode: '', msgType: 'EMAIL' }
    });

    const msgTypeValue = watch('msgType');

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');
        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingId(Number(idParam));
        }
    }, [searchParams]);

    // Fetch template detail for edit mode
    const { data: templateData, isLoading: isLoadingTemplate } = useQuery({
        queryKey: ['template-detail-edit', editingId],
        queryFn: () => axiosOperations.request({
            method: 'GET',
            url: 'messagingTemplate/getMessageTemplateById',
            params: { id: editingId }
        }),
        enabled: !!editingId && isEditMode,
    });

    useEffect(() => {
        if (templateData?.data?.messageTemplate && isEditMode && !isFormInitialized) {
            const template = templateData.data.messageTemplate;
            setValue('title', template.title || '');
            setValue('templateCode', template.templateCode || '');
            setValue('msgType', template.msgType || 'EMAIL');
            setEditorValue(template.templateMsg || '');
            setIsFormInitialized(true);
        }
    }, [templateData, isEditMode, setValue, isFormInitialized]);

    const saveTemplateMutation = useMutation({
        mutationFn: (formData: any) => axiosOperations.request({
            method: 'POST',
            url: 'messagingTemplate/save',
            data: formData
        }),
        onSuccess: (data) => {
            if (data?.data?.code === '000') {
                toast.success(isEditMode ? 'Template updated successfully!' : 'Template created successfully!');
                router.push('/operations/message-templates');
            } else {
                toast.error(data?.data?.desc || 'Failed to save template');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error saving template');
        }
    });

    const onSubmit = (data: TemplateFormData) => {
        if (!editorValue.trim()) {
            toast.error('Please enter template message');
            return;
        }
        const payload = {
            id: isEditMode ? (editingId || 0) : 0,
            entityCode: 'FTD',
            msgType: data.msgType,
            title: data.title,
            templateCode: data.templateCode,
            templateMsg: editorValue
        };
        saveTemplateMutation.mutate(payload);
    };

    if (isLoadingTemplate) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-medium-gray">Loading template...</p>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-md lg:text-lg font-medium text-dark-gray">
                            {isEditMode ? 'Edit Message Template' : 'Create Message Template'}
                        </h1>
                        <p className="text-xs lg:text-sm font-normal text-medium-gray">
                            {isEditMode ? 'Update template information' : 'Create a new email or SMS template'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='bg-white px-6 py-4 rounded-2xl'>
                            <FormSection title="Template Information" subtitle="Template details and classification.">
                                <FormField label="Message Type" required>
                                    <Select value={msgTypeValue || 'EMAIL'} onValueChange={(value) => setValue('msgType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select message type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EMAIL">Email</SelectItem>
                                            <SelectItem value="SMS">SMS</SelectItem>
                                            <SelectItem value="PUSH">Push</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Template Code" required>
                                    <Input
                                        {...register('templateCode', { required: 'Template code is required' })}
                                        placeholder="Enter template code"
                                        disabled={isEditMode}
                                    />
                                    {isEditMode && <p className="text-xs text-medium-gray mt-1">Code cannot be changed</p>}
                                    {errors.templateCode && <p className="text-xs text-red-500">{errors.templateCode.message}</p>}
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Template Title" required>
                                        <Input
                                            {...register('title', { required: 'Template title is required' })}
                                            placeholder="Enter template title"
                                        />
                                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                                    </FormField>
                                </div>
                            </FormSection>

                            <FormSection title="Template Message" subtitle="Compose the template content using Markdown.">
                                <div className="col-span-2 space-y-2">
                                    <Label>Template Message *</Label>
                                    <MDEditor
                                        value={editorValue}
                                        onChange={(value) => setEditorValue(value || '')}
                                        height={300}
                                        preview="edit"
                                    />
                                    {!editorValue.trim() && (
                                        <p className="text-xs text-red-500">Template message is required</p>
                                    )}
                                </div>
                            </FormSection>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={saveTemplateMutation.isPending}>
                                {saveTemplateMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : (isEditMode ? 'Update Template' : 'Create Template')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}