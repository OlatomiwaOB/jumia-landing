'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { useMutation } from '@tanstack/react-query';
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

export default function CreateMessagingTemplatePage() {
  const { usePermissionGuard } = usePermission();

  usePermissionGuard('MANAGE_MESSAGE_TEMPLATES', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage message templates"
  });
  const router = useRouter();
  const [editorValue, setEditorValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TemplateFormData>({
    defaultValues: {
      title: '',
      templateCode: '',
      msgType: 'EMAIL'
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: (formData: any) =>
      axiosOperations.request({
        method: 'POST',
        url: 'messagingTemplate/save',
        data: formData
      }),
    onSuccess: (data) => {
      if (data?.data?.code === '000') {
        toast.success('Messaging Template created successfully!');
        router.push('/operations/message-templates');
      } else {
        toast.error(data?.data?.desc || 'Failed to create template');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error creating template');
    }
  });

  const onSubmit = (data: TemplateFormData) => {
    if (!editorValue.trim()) {
      toast.error('Please enter template message');
      return;
    }

    const payload = {
      id: 0,
      entityCode: 'FTD',
      msgType: data.msgType,
      title: data.title,
      templateCode: data.templateCode,
      templateMsg: editorValue
    };

    createTemplateMutation.mutate(payload);
  };

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
            Back to Templates
          </Button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Save className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-accent-foreground">
              Create Messaging Template
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a new email or SMS template
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
                    <Label htmlFor="msgType">Message Type *</Label>
                    <Select
                      value={msgTypeValue}
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
                    <Label htmlFor="templateCode">Template Code *</Label>
                    <Input
                      id="templateCode"
                      {...register('templateCode', { required: 'Template code is required' })}
                      placeholder="Enter template code"
                    />
                    {errors.templateCode && (
                      <p className="text-sm text-red-500">{errors.templateCode.message}</p>
                    )}
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
                    preview="live"
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
                disabled={createTemplateMutation.isPending}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}