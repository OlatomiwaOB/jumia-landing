'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TemplateData {
  id: number;
  title: string;
  msgType: string;
  templateCode: string;
  templateMsg: string;
  entityCode: string;
}

interface TemplateListProps {
  isFetching: boolean;
  data: any;
  paginatorInfo: any;
}

const getMsgTypeColor = (msgType: string): string => {
  switch (msgType?.toUpperCase()) {
    case 'EMAIL':
      return 'bg-blue-500 text-white';
    case 'SMS':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getDisplayValue = (value: any): string => {
  return value?.toString() || 'N/A';
};

export default function TemplateList({ isFetching, data, paginatorInfo }: TemplateListProps) {
  const router = useRouter();

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const templates = Array.isArray(data) ? data : [];

  if (templates.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 flex-col gap-4">
        <p className="text-gray-500">No message templates found</p>
        <Button asChild>
          <Link href="/operations/message-templates/create">Create Your First Template</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-3 font-bold text-sm text-gray-700 w-20">S/N</th>
            <th className="text-left p-3 font-bold text-sm text-gray-700">Title</th>
            <th className="text-left p-3 font-bold text-sm text-gray-700">Message Type</th>
            <th className="text-left p-3 font-bold text-sm text-gray-700">Template Code</th>
            <th className="text-left p-3 font-bold text-sm text-gray-700 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template: TemplateData, index: number) => {
            const serialNo = ((paginatorInfo.currentPage - 1) * paginatorInfo.perPage) + index + 1;
            
            return (
              <tr
                key={template.id}
                className={`border-b border-gray-200 ${index === templates.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="p-3 text-sm">{serialNo}</td>
                <td className="p-3 text-sm">
                  <p className="font-medium text-gray-900">{getDisplayValue(template.title)}</p>
                </td>
                <td className="p-3 text-sm">
                  <Badge className={`${getMsgTypeColor(template.msgType)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(template.msgType)}
                  </Badge>
                </td>
                <td className="p-3 text-sm">{getDisplayValue(template.templateCode)}</td>
                <td className="p-3 text-sm">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      asChild
                    >
                      <Link href={`/operations/message-templates/${template.id}`}>
                        <Eye className="w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      asChild
                    >
                      <Link href={`/operations/message-templates/edit/${template.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}