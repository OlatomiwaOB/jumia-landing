'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import {
    Bell,
    Info,
    AlertCircle,
    CheckCircle,
    MessageSquare,
    TrendingUp,
    Archive,
    ArchiveX,
    ChevronDown,
    ChevronRight,
    Mail,
    MailOpen,
    Star,
    Clock,
    RefreshCw,
    Banknote
} from 'lucide-react';

interface Notification {
    id: number;
    entityCode: string;
    notificationType: 'BROADCAST' | 'NEW' | 'TRANSACTION' | 'FEEDBACK' | 'STATUS' | 'INFO';
    title: string;
    message: string;
    logo: string;
    username: string;
    status: 'UNREAD' | 'READ' | 'ARCHIVED';
}

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const getNotificationIcon = (type: Notification['notificationType']) => {
    switch (type) {
        case 'BROADCAST':
            return <Bell className="w-4 h-4" />;
        case 'NEW':
            return <Star className="w-4 h-4" />;
        case 'TRANSACTION':
            return <Banknote className="w-4 h-4" />;
        case 'FEEDBACK':
            return <MessageSquare className="w-4 h-4" />;
        case 'STATUS':
            return <AlertCircle className="w-4 h-4" />;
        case 'INFO':
            return <Info className="w-4 h-4" />;
        default:
            return <Bell className="w-4 h-4" />;
    }
};

const getStatusIcon = (status: Notification['status']) => {
    switch (status) {
        case 'UNREAD':
            return <Mail className="w-3 h-3" />;
        case 'READ':
            return <MailOpen className="w-3 h-3" />;
        case 'ARCHIVED':
            return <Archive className="w-3 h-3" />;
    }
};

const NotificationDetailModal = ({
    notification,
    isOpen,
    onClose,
    onArchive
}: {
    notification: Notification | null;
    isOpen: boolean;
    onClose: () => void;
    onArchive: (id: number) => void;
}) => {
    if (!notification) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className='flex flex-col'>
                    <DialogTitle className="flex items-center gap-2">
                        {getNotificationIcon(notification.notificationType)}
                        <span>{notification.title}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {``}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{notification.message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {notification.status !== 'ARCHIVED' && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                onArchive(notification.id);
                                onClose();
                            }}
                        >
                            <ArchiveX className="w-4 h-4 mr-2" />
                            Archive
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const queryClient = useQueryClient();

    const { data: notificationsData, isLoading, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await axiosInstance.get('/notification/fetch', {
                params: {
                    status: ''
                }
            });
            return response.data.notificationInfo as Notification[];
        },
        enabled: isOpen,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const response = await axiosInstance.post('/notification/update-status', {
                id,
                status
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['notifications'], (oldData: Notification[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(notification =>
                    notification.id === variables.id
                        ? { ...notification, status: variables.status as Notification['status'] }
                        : notification
                );
            });

            if (variables.status === 'ARCHIVED') {
                toast.success('Message archived successfully');
            }
        },
        onError: () => {
            toast.error('Failed to update notification status');
        }
    });

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setIsDetailOpen(true);

        if (notification.status === 'UNREAD') {
            updateStatusMutation.mutate({ id: notification.id, status: 'READ' });
        }
    };

    const handleArchive = (id: number) => {
        updateStatusMutation.mutate({ id, status: 'ARCHIVED' });
    };

    const groupedNotifications = React.useMemo(() => {
        if (!notificationsData) return { unread: [], read: [], archived: [] };

        return {
            unread: notificationsData.filter(n => n.status === 'UNREAD'),
            read: notificationsData.filter(n => n.status === 'READ'),
            archived: notificationsData.filter(n => n.status === 'ARCHIVED'),
        };
    }, [notificationsData]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <div className=''>
                            <div className="flex items-center gap-5">
                                <DialogTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Notifications
                                </DialogTitle>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                            <DialogDescription>
                                Stay updated with your latest notifications
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {groupedNotifications.unread.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold flex items-center gap-2">
                                            <Badge variant="default" className="bg-accent">Unread</Badge>
                                            <span className="text-xs text-muted-foreground">{groupedNotifications.unread.length}</span>
                                        </h3>
                                        <div className="space-y-2">
                                            {groupedNotifications.unread.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className="w-full text-left p-3 rounded-lg bg-accent/20 hover:bg-accent/40 transition-colors border-2 border-accent/60"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 text-accent">
                                                            {getNotificationIcon(notification.notificationType)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-sm">{notification.title}</span>
                                                                <div className="h-4 text-accent">
                                                                    {getStatusIcon(notification.status)}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-light line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Badge className="bg-accent text-[10px] h-5">New</Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleArchive(notification.id);
                                                                }}
                                                            >
                                                                <ArchiveX className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {groupedNotifications.read.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold flex items-center gap-2">
                                            <Badge variant="outline" className='border-2 border-accent-foreground/80'>Read</Badge>
                                            <span className="text-xs text-muted-foreground">{groupedNotifications.read.length}</span>
                                        </h3>
                                        <div className="space-y-2">
                                            {groupedNotifications.read.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className="w-full text-left p-3 rounded-lg bg-accent-foreground/20 hover:bg-accent-foreground/40 transition-colors border-2 border-accent-foreground/60"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 text-muted-foreground">
                                                            {getNotificationIcon(notification.notificationType)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-sm">
                                                                    {notification.title}
                                                                </span>
                                                                <div className="h-4 text-accent">
                                                                    {getStatusIcon(notification.status)}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-light line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleArchive(notification.id);
                                                            }}
                                                        >
                                                            <ArchiveX className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {groupedNotifications.archived.length > 0 && (
                                    <div className="space-y-2 border-t pt-4">
                                        <button
                                            onClick={() => setShowArchived(!showArchived)}
                                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
                                        >
                                            {showArchived ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                            <Archive className="w-4 h-4" />
                                            <span>Archived Messages</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {groupedNotifications.archived.length}
                                            </Badge>
                                        </button>

                                        {showArchived && (
                                            <div className="space-y-2 mt-2">
                                                {groupedNotifications.archived.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className="w-full text-left p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors opacity-70"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5 text-muted-foreground">
                                                                {getNotificationIcon(notification.notificationType)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-medium text-xs text-muted-foreground">
                                                                        {notification.title}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground/70 line-clamp-1">
                                                                    {notification.message}
                                                                </p>
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
                                            <Bell className="w-8 h-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                                        </div>
                                    )}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="border-t p-4 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                            {groupedNotifications.unread.length} unread, {groupedNotifications.read.length} read
                        </span>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <NotificationDetailModal
                notification={selectedNotification}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onArchive={handleArchive}
            />
        </>
    );
};

export default NotificationsModal;