'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import cn from 'classnames';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
// import { usePermission } from '@/hooks/usePermission';

interface DashboardResponse {
    responseCode: string;
    responseMessage: string;
    totalRevenue: number;
    totalUsers: number;
    totalMerchants: number;
    totalRiders: number;
    merchantStatusBreakdown: {
        APPROVED: number;
        PENDING: number;
        DECLINED: number;
    };
    monthlyRevenueTrend: Array<{
        volume: number;
        month_name: string;
        total_amount: number;
    }>;
    topMerchants: Array<{
        business_name: string;
        order_count: number;
        merchant_id: string;
        total_sales: number;
    }>;
    topRiders: Array<{
        business_name?: string;
        rider_name?: string;
        order_count?: number;
        rider_id?: string;
        total_sales?: number;
    }>;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-NG').format(num);
};

const MetricCard = ({
    title,
    value,
    isPrimary = false
}: {
    title: string;
    value: string | number;
    isPrimary?: boolean;
}) => {
    return (
        <Card className={cn(
            'relative overflow-hidden border border-accent/20 rounded-xl transition-all duration-300',
            isPrimary
                ? 'bg-accent text-white'
                : 'bg-white text-accent-foreground'
        )}>
            <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
                <div className={cn(
                    "rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 transform origin-center",
                    isPrimary ? "bg-white/20" : "bg-accent/30"
                )} />
                <div className={cn(
                    "rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 transform origin-center",
                    isPrimary ? "bg-white/20" : "bg-accent/30"
                )} />
            </div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                        "text-sm font-medium",
                        isPrimary ? "text-white/90" : "text-accent-foreground/70"
                    )}>
                        {title}
                    </span>
                </div>

                <p className={cn(
                    "text-3xl font-bold mb-2",
                    isPrimary ? "text-white" : "text-accent-foreground"
                )}>
                    {value}
                </p>
            </CardContent>
        </Card>
    );
};

const DonutChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [formatNumber(value), '']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
                <p className="text-2xl font-bold text-accent-foreground">{formatNumber(total)}</p>
                <p className="text-xs text-accent-foreground/70">Total Merchants</p>
            </div>
        </div>
    );
};

const RevenueTrendChart = ({ data }: { data: Array<{ month_name: string; total_amount: number }> }) => {
    const filteredData = data.filter(item => item.total_amount > 0 || item.month_name !== '');
    const displayData = filteredData.length > 0 ? filteredData : data;

    const maxRevenue = Math.max(...displayData.map(item => item.total_amount), 0);
    const yAxisMax = Math.ceil(maxRevenue / 150000) * 150000 || 150000;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid
                    strokeDasharray="5 5"
                    stroke="#e2e8f0"
                    vertical={false}
                />
                <XAxis
                    dataKey="month_name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₦${value / 1000}k`}
                    domain={[0, yAxisMax]}
                />
                <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D8480B" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#d26131" stopOpacity={0.8} />
                    </linearGradient>
                    <filter id="shadow" x="-0.5" y="-0.5" width="2" height="2">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#8B5F4C" floodOpacity="0.3" />
                    </filter>
                </defs>
                <Line
                    type="monotone"
                    dataKey="total_amount"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{
                        fill: '#D8480B',
                        stroke: '#D8480B',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'url(#shadow)'
                    }}
                    activeDot={{ r: 7, fill: '#d26131', stroke: '#D8480B', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const HorizontalBarChart = ({ data, title, valuePrefix = '₦' }: { data: any[]; title: string; valuePrefix?: string }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-accent-foreground/50">
                No data available
            </div>
        );
    }

    const maxRevenue = Math.max(...data.map(item => item.total_sales || item.revenue || 0));

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {data.map((item, index) => {
                    const revenue = item.total_sales || item.revenue || 0;
                    const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                    const name = item.business_name || item.name || item.rider_name || 'Unknown';

                    return (
                        <div key={item.merchant_id || item.rider_id || index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-accent-foreground/80 truncate max-w-[60%]" title={name}>
                                    {name}
                                </span>
                                <span className="font-medium text-accent-foreground whitespace-nowrap">
                                    {valuePrefix}{formatNumber(revenue)}
                                </span>
                            </div>
                            <div className="relative h-8 bg-accent/10 rounded-lg overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-accent rounded-lg transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                                {/* {percentage > 15 && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                                        {valuePrefix}{formatNumber(revenue)}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function OperationsDashboard() {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('VIEW_DASHBOARD', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to view dashboard"
    // });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [selectedFilter, setSelectedFilter] = useState('this_month');

    const filterOptions = [
        { value: 'this_week', label: 'This Week' },
        { value: 'last_week', label: 'Last Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' },
        { value: 'this_year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' },
    ];

    const calculateDateRange = (filter: string, customStart?: string, customEnd?: string) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (filter) {
            case 'this_week':
                const day = now.getDay();
                start = new Date(now);
                start.setDate(now.getDate() - day);
                start.setHours(0, 0, 0, 0);
                end = new Date();
                break;
            case 'last_week':
                const lastWeekStart = new Date(now);
                lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
                lastWeekStart.setHours(0, 0, 0, 0);
                start = lastWeekStart;
                end = new Date(lastWeekStart);
                end.setDate(lastWeekStart.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            case 'this_month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date();
                break;
            case 'last_month':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'this_year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date();
                break;
            case 'custom':
                if (customStart && customEnd) {
                    const [sDay, sMonth, sYear] = customStart.split('-');
                    const [eDay, eMonth, eYear] = customEnd.split('-');
                    start = new Date(parseInt(sYear), parseInt(sMonth) - 1, parseInt(sDay));
                    end = new Date(parseInt(eYear), parseInt(eMonth) - 1, parseInt(eDay));
                }
                break;
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date();
        }

        return {
            startDate: `${start.getDate().toString().padStart(2, '0')}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getFullYear()}`,
            endDate: `${end.getDate().toString().padStart(2, '0')}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getFullYear()}`
        };
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const [day, month, year] = dateStr.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const formatDateForApi = (date: Date): string => {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const { data: dashboardData, isLoading, error, refetch } = useQuery<DashboardResponse>({
        queryKey: ['dashboard-summary', dateRange.startDate, dateRange.endDate],
        queryFn: async () => {
            const params: any = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                entityCode: process.env.NEXT_PUBLIC_ENTITYCODE
            };

            const response = await axiosOperations.request({
                method: 'GET',
                url: '/store-dashboard/adminSummary',
                params,
            });
            return response.data;
        },
        enabled: !!dateRange.startDate && !!dateRange.endDate,
    });

    // Handle filter change
    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        if (filter === 'custom') {
            setShowCalendar(true);
            setIsFilterOpen(false);
        } else {
            const range = calculateDateRange(filter);
            setDateRange(range);
            setIsFilterOpen(false);
        }
    };

    const handleCustomDateApply = () => {
        if (customStartDate && customEndDate) {
            const range = calculateDateRange('custom', customStartDate, customEndDate);
            setDateRange(range);
            setShowCalendar(false);
            setSelectedFilter('custom');
        }
    };

    const handleCustomDateCancel = () => {
        setCustomStartDate('');
        setCustomEndDate('');
        setShowCalendar(false);
    };

    useEffect(() => {
        const initialRange = calculateDateRange('this_month');
        setDateRange(initialRange);
    }, []);

    const merchantStatusData = dashboardData?.merchantStatusBreakdown ? [
        { name: 'Approved', value: dashboardData.merchantStatusBreakdown.APPROVED || 0, color: '#D8480B' },
        { name: 'Pending', value: dashboardData.merchantStatusBreakdown.PENDING || 0, color: '#F59E0B' },
        { name: 'Declined', value: dashboardData.merchantStatusBreakdown.DECLINED || 0, color: '#ff0303' },
    ] : [];

    const revenueTrendData = dashboardData?.monthlyRevenueTrend || [];

    const topMerchantsData = dashboardData?.topMerchants

    const topRidersData = dashboardData?.topRiders

    if (isLoading && !dashboardData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-2 text-accent-foreground/70">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Error loading dashboard data</p>
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-accent/20 hover:bg-accent/10"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-accent-foreground mb-2">
                                Operations Dashboard
                            </h1>
                            <p className="text-accent-foreground/70">
                                Overview of key metrics and performance indicators
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className="border-accent/20 hover:bg-accent/10"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button> */}

                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center justify-between gap-2 rounded-lg border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    style={{ minWidth: '200px' }}
                                >
                                    <Calendar className="h-4 w-4 text-accent" />
                                    <span>
                                        {filterOptions.find(opt => opt.value === selectedFilter)?.label || 'Select Filter'}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isFilterOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsFilterOpen(false)}
                                        />
                                        <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-accent/20 bg-white py-1 shadow-lg">
                                            {filterOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleFilterChange(option.value)}
                                                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-accent/5 ${selectedFilter === option.value
                                                        ? 'bg-accent/10 text-accent'
                                                        : 'text-accent-foreground'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {dateRange.startDate && dateRange.endDate && (
                        <div className="mt-2 flex justify-end">
                            <p className="text-sm text-accent-foreground/70">
                                Showing data from {formatDisplayDate(dateRange.startDate)} to {formatDisplayDate(dateRange.endDate)}
                            </p>
                        </div>
                    )}
                </div>

                {showCalendar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="rounded-lg bg-white p-6 shadow-xl" style={{ width: '400px' }}>
                            <h3 className="text-lg font-medium text-accent-foreground mb-4">Select Date Range</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-accent-foreground">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={customStartDate ? (() => {
                                            const [day, month, year] = customStartDate.split('-');
                                            return `${year}-${month}-${day}`;
                                        })() : ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (date) {
                                                const [year, month, day] = date.split('-');
                                                setCustomStartDate(`${day}-${month}-${year}`);
                                            }
                                        }}
                                        className="border-accent/20 focus:border-accent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-accent-foreground">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={customEndDate ? (() => {
                                            const [day, month, year] = customEndDate.split('-');
                                            return `${year}-${month}-${day}`;
                                        })() : ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (date) {
                                                const [year, month, day] = date.split('-');
                                                setCustomEndDate(`${day}-${month}-${year}`);
                                            }
                                        }}
                                        className="border-accent/20 focus:border-accent"
                                        min={customStartDate ? (() => {
                                            const [day, month, year] = customStartDate.split('-');
                                            return `${year}-${month}-${day}`;
                                        })() : undefined}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCustomDateCancel}
                                    className="border-accent/20 hover:bg-accent/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCustomDateApply}
                                    disabled={!customStartDate || !customEndDate}
                                    className="bg-accent hover:bg-accent/90 text-white"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Revenue"
                        value={formatCurrency(dashboardData?.totalRevenue || 0)}
                        isPrimary={true}
                    />
                    <MetricCard
                        title="Total Users"
                        value={formatNumber(dashboardData?.totalUsers || 0)}
                    />
                    <MetricCard
                        title="Total Merchants"
                        value={formatNumber(dashboardData?.totalMerchants || 0)}
                    />
                    <MetricCard
                        title="Total Riders"
                        value={formatNumber(dashboardData?.totalRiders || 0)}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader className="border-b border-accent/10">
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Merchant Status
                            </CardTitle>
                            <p className="text-xs text-accent-foreground/70 mt-1">
                                Distribution of merchant approval status
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            {merchantStatusData.length > 0 && merchantStatusData.some(s => s.value > 0) ? (
                                <>
                                    <DonutChart data={merchantStatusData} />
                                    <div className="flex justify-center gap-6 mt-4">
                                        {merchantStatusData.map((status) => (
                                            <div key={status.name} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                                                <span className="text-sm text-accent-foreground/80">{status.name}</span>
                                                <span className="text-sm font-semibold text-accent-foreground">{formatNumber(status.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-accent-foreground/50">
                                    No merchant status data available
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader className="border-b border-accent/10">
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Revenue Trend
                            </CardTitle>
                            <p className="text-xs text-accent-foreground/70 mt-1">
                                Monthly revenue performance
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            {revenueTrendData.length > 0 && revenueTrendData.some(r => r.total_amount > 0) ? (
                                <RevenueTrendChart data={revenueTrendData} />
                            ) : (
                                <div className="flex items-center justify-center h-64 text-accent-foreground/50">
                                    No revenue data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader className="border-b border-accent/10">
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Top Merchants by Revenue
                            </CardTitle>
                            <p className="text-xs text-accent-foreground/70 mt-1">
                                Highest earning merchants in selected period
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <HorizontalBarChart data={topMerchantsData} title="" />
                        </CardContent>
                    </Card>

                    <Card className="border-accent/20 shadow-sm">
                        <CardHeader className="border-b border-accent/10">
                            <CardTitle className="text-lg font-semibold text-accent-foreground">
                                Top Riders by Revenue
                            </CardTitle>
                            <p className="text-xs text-accent-foreground/70 mt-1">
                                Highest earning riders in selected period
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <HorizontalBarChart data={topRidersData} title="" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}