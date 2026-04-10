'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { usePermission } from '@/hooks/usePermission';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);


interface TemplateFormData {
  title: string;
  templateCode: string;
  msgType: string;
}

export default function EditMessagingTemplatePage() {
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage message templates"
  });
  const router = useRouter();
  const params = useParams();
  const templateId = params.id;

  const [editorValue, setEditorValue] = useState('');

  const { data: templateData, isLoading } = useQuery({
    queryKey: ['template-detail-edit', templateId],
    queryFn: () => axiosOperations.request({
      method: 'GET',
      url: 'messagingTemplate/getMessageTemplateById',
      params: {
        id: templateId
      }
    }),
    enabled: !!templateId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<TemplateFormData>();

  useEffect(() => {
    if (templateData?.data?.messageTemplate) {
      const template = templateData.data.messageTemplate;
      reset({
        title: template.title,
        templateCode: template.templateCode,
        msgType: template.msgType
      });
      setEditorValue(template.templateMsg || '');
    }
  }, [templateData, reset]);

  const updateTemplateMutation = useMutation({
    mutationFn: (formData: any) =>
      axiosOperations.request({
        method: 'POST',
        url: 'messagingTemplate/save',
        data: formData
      }),
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Messaging Template updated successfully!');
        router.push(`/operations/message-templates/${templateId}`);
      } else {
        toast.error(data?.data?.desc || 'Failed to update template');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error updating template');
    }
  });

  const onSubmit = (data: TemplateFormData) => {
    if (!editorValue.trim()) {
      toast.error('Please enter template message');
      return;
    }

    const payload = {
      id: templateId,
      entityCode: 'FTD',
      msgType: data.msgType,
      title: data.title,
      templateCode: data.templateCode,
      templateMsg: editorValue
    };

    updateTemplateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  const template = templateData?.data?.messageTemplate;

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Template not found</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const msgTypeValue = watch('msgType');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Template
          </Button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Save className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-accent-foreground">
              Edit Messaging Template
            </h1>
            <p className="text-muted-foreground mt-2">
              Update template information
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-gray-200 shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Template Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="msgType">Message Type</Label>
                    <Select
                      value={msgTypeValue || template.msgType}
                      onValueChange={(value) => setValue('msgType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="PUSH">Push</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="templateCode">Template Code</Label>
                    <Input
                      id="templateCode"
                      value={template.templateCode}
                      readOnly
                      disabled
                      className="bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Template code cannot be changed</p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title">Template Title *</Label>
                    <Input
                      id="title"
                      {...register('title', { required: 'Template title is required' })}
                      placeholder="Enter template title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template Message *</Label>
                  <MDEditor
                    value={editorValue}
                    onChange={(value) => setEditorValue(value || '')}
                    height={200}
                    preview="edit"
                  />
                  {!editorValue.trim() && (
                    <p className="text-sm text-red-500">Template message is required</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateTemplateMutation.isPending}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {updateTemplateMutation.isPending ? 'Updating...' : 'Update Template'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}