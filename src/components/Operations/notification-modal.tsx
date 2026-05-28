'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import { toast } from 'sonner';
import {
    Bell,
    Info,
    AlertCircle,
    MessageSquare,
    ChevronDown,
    ChevronRight,
    Star,
    RefreshCw,
    Banknote,
    X,
} from 'lucide-react';
import { ArchiveIcon } from '../icons/icons';

interface Notification {
    id: number;
    entityCode: string;
    notificationType: 'BROADCAST' | 'NEW' | 'TRANSACTION' | 'FEEDBACK' | 'STATUS' | 'INFO';
    title: string;
    message: string;
    logo: string;
    username: string;
    status: 'UNREAD' | 'READ' | 'ARCHIVED';
    audience: string;
    createdDate: string;
}

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement>;
    onNotificationRead?: () => void;
}

const getNotificationIcon = (type: Notification['notificationType']) => {
    switch (type) {
        case 'BROADCAST': return <Bell className="w-4 h-4" />;
        case 'NEW': return <Star className="w-4 h-4" />;
        case 'TRANSACTION': return <Banknote className="w-4 h-4" />;
        case 'FEEDBACK': return <MessageSquare className="w-4 h-4" />;
        case 'STATUS': return <AlertCircle className="w-4 h-4" />;
        case 'INFO': return <Info className="w-4 h-4" />;
        default: return <Bell className="w-4 h-4" />;
    }
};

const NotificationDetailPanel = ({
    notification,
    onClose,
    onArchive,
}: {
    notification: Notification;
    onClose: () => void;
    onArchive: (id: number) => void;
}) => (
    <div className="flex flex-col h-full">

        <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-dark-gray">{notification.title}</h2>
            </div>
            <button
                onClick={onClose}
                className="bg-white p-1 rounded-full text-medium-gray hover:opacity-100 opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

        <div className="px-5 pb-2">
            <p className="text-xs text-medium-gray">{notification.createdDate}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2" style={{ scrollbarWidth: 'none' }}>
            <div className="bg-white rounded-2xl p-4">
                <p className="text-sm text-dark-gray whitespace-pre-wrap">{notification.message}</p>
            </div>
        </div>

        <div className="flex items-center rounded-b-2xl justify-end gap-3 p-4 bg-white">
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
            {notification.status !== 'ARCHIVED' && (
                <Button
                    onClick={() => {
                        onArchive(notification.id);
                        onClose();
                    }}
                >
                    <ArchiveIcon className="w-4 h-4 mr-2" />
                    Archive
                </Button>
            )}
        </div>
    </div>
);

const NotificationsModal = ({ isOpen, onClose, anchorRef, onNotificationRead }: NotificationsModalProps) => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showArchived, setShowArchived] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, anchorRef]);

    const { data: notificationsData, isLoading, refetch } = useQuery({
        queryKey: ['notifications-modal'],
        queryFn: async () => {
            const response = await axiosOperations.get('/notification/fetch', {
                params: { status: '' }
            });
            return response.data.notificationInfo as Notification[];
        },
        enabled: isOpen,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const response = await axiosOperations.post('/notification/update-status', { id, status });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['notifications-modal'], (oldData: Notification[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(notification =>
                    notification.id === variables.id
                        ? { ...notification, status: variables.status as Notification['status'] }
                        : notification
                );
            });

            if (variables.status === 'ARCHIVED') {
                toast.success('Message archived successfully');
            } else if (variables.status === 'READ') {
                onNotificationRead?.();
            }
        },
        onError: () => {
            toast.error('Failed to update notification status');
        }
    });

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        if (notification.status === 'UNREAD') {
            updateStatusMutation.mutate({ id: notification.id, status: 'READ' });
        }
    };

    const handleArchive = (id: number) => {
        updateStatusMutation.mutate({ id, status: 'ARCHIVED' });
    };

    const handleBackToList = () => setSelectedNotification(null);

    const groupedNotifications = React.useMemo(() => {
        if (!notificationsData) return { unread: [], read: [], archived: [] };
        return {
            unread: notificationsData.filter(n => n.status === 'UNREAD'),
            read: notificationsData.filter(n => n.status === 'READ'),
            archived: notificationsData.filter(n => n.status === 'ARCHIVED'),
        };
    }, [notificationsData]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed bg-black/50 inset-0 z-40"
                onClick={onClose}
            />

            <div
                ref={dropdownRef}
                className="fixed z-50 right-4 top-[72px] w-[340px] sm:w-[400px] bg-[#F5F5F5] rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
                style={{ maxHeight: 'calc(100vh - 96px)' }}
            >
                {selectedNotification ? (
                    <NotificationDetailPanel
                        notification={selectedNotification}
                        onClose={handleBackToList}
                        onArchive={handleArchive}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between px-3 mx-4 pt-5 pb-1 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                <h2 className="text-lg font-semibold text-dark-gray">Notifications</h2>
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => refetch()}
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`w-2 h-2 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                            <button
                                onClick={onClose}
                                className="ring-offset-background bg-white p-2 rounded-full cursor-pointer text-dark-gray opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none absolute top-4 right-4"
                            >
                                <X className="w-5 h-5 text-medium-gray" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 mb-2 mx-4 rounded-2xl px-3" style={{ scrollbarWidth: 'none' }}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <RefreshCw className="w-6 h-6 animate-spin text-medium-gray" />
                                </div>
                            ) : (
                                <div className="space-y-4 pb-2">
                                    {groupedNotifications.unread.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 px-1">
                                                <Badge className="bg-faded-accent text-white text-xs font-medium px-2 py-0.5">All</Badge>
                                                <Badge className="bg-white text-medium-gray border-1 border-gray-200 text-xs font-medium px-2 py-0.5">Unread ({groupedNotifications.unread.length})</Badge>
                                                <span className="text-xs text-medium-gray"></span>
                                            </div>
                                            <div className="space-y-2">
                                                {groupedNotifications.unread.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className="w-full text-left p-4 rounded-xl bg-white hover:shadow-md transition-all border border-accent/20"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-sm text-dark-gray">{notification.title}</span>
                                                                    <Badge className="bg-white border-1 border-faded-accent text-faded-accent text-[10px] px-2 py-0 font-medium">New</Badge>
                                                                </div>
                                                                <p className="text-xs text-medium-gray line-clamp-2">{notification.message}</p>
                                                            </div>
                                                            <div className='flex flex-col justify-end'>
                                                                <p className="text-xs text-medium-gray">
                                                                    {notification.createdDate.split(' ')[0]}
                                                                </p>
                                                                <div className='justify-end items-end flex'>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6"
                                                                        onClick={(e) => { e.stopPropagation(); handleArchive(notification.id); }}
                                                                    >
                                                                        <ArchiveIcon className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {groupedNotifications.read.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-white text-medium-gray border-1 border-gray-200 text-xs font-medium px-2 py-0.5">Read ({groupedNotifications.read.length})</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                {groupedNotifications.read.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className="w-full text-left p-4 rounded-xl bg-white hover:shadow-md transition-all border border-gray-100"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-sm text-dark-gray">{notification.title}</span>
                                                                </div>
                                                                <p className="text-xs text-medium-gray font-light line-clamp-2">{notification.message}</p>
                                                            </div>
                                                            <div className='flex flex-col justify-end'>
                                                                <p className="text-xs text-medium-gray">
                                                                    {notification.createdDate.split(' ')[0]}
                                                                </p>
                                                                <div className='justify-end items-end flex'>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6"
                                                                        onClick={(e) => { e.stopPropagation(); handleArchive(notification.id); }}
                                                                    >
                                                                        <ArchiveIcon className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {groupedNotifications.archived.length > 0 && (
                                        <div className="space-y-2 border-t border-gray-200 pt-4">
                                            <button
                                                onClick={() => setShowArchived(!showArchived)}
                                                className="flex items-center gap-2 text-sm font-semibold text-dark-gray hover:text-accent transition-colors w-full px-1"
                                            >
                                                {showArchived ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                <ArchiveIcon className="w-4 h-4" />
                                                <span>Archived Messages</span>
                                                <Badge className="bg-gray-100 text-dark-gray text-xs font-medium">
                                                    {groupedNotifications.archived.length}
                                                </Badge>
                                            </button>

                                            {showArchived && (
                                                <div className="space-y-2 mt-2">
                                                    {groupedNotifications.archived.map((notification) => (
                                                        <button
                                                            key={notification.id}
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className="w-full text-left p-4 rounded-xl bg-white/50 hover:bg-white transition-all border border-gray-100"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-medium text-xs text-medium-gray">{notification.title}</span>
                                                                    </div>
                                                                    <p className="text-xs text-medium-gray/50 line-clamp-1">{notification.message}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isLoading &&
                                        groupedNotifications.unread.length === 0 &&
                                        groupedNotifications.read.length === 0 &&
                                        groupedNotifications.archived.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                                <Bell className="w-8 h-8 text-medium-gray mb-2" />
                                                <p className="text-sm text-medium-gray font-medium">No notifications yet</p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default NotificationsModal;