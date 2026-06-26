'use client'
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosOperations from '@/utils/fetch-function-op-auth';
import cn from 'classnames';
// import {} from 'date-range-picker'


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
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import { usePermission } from '@/hooks/usePermission';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { ArrowIcon } from '@/components/icons/icons';
import { getClientIdentifiers } from '@/config/client-config';

interface DashboardResponse {
    responseCode: string;
    responseMessage: string;
    totalRevenue: number;
    totalUsers: number;
    totalMerchants: number;
    totalRiders: number;
    orderVolume?: number;
    merchantActivityBreakdown?: {
        activeMerchants?: number;
        inactiveMerchants?: number;
    };
    customerActivityBreakdown?: {
        activeCustomers?: number;
        inactiveCustomers?: number;
    };
    topCustomers?: Array<{
        customer_name?: string;
        customer_id?: string;
        total_spend?: number;
        order_count?: number;
    }>;
    transactionValueAndVolume?: Array<{
        tran_type: string;
        volume: number;
        value: number;
    }>;
    merchantStatusBreakdown: {
        APPROVED: number;
        PENDING: number;
        DECLINED: number;
    };
    orderVolumeSummary?: {
        order_value: number;
        order_volume: number;
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
        fullname?: string;
        total_revenue?: number;
        delivery_count?: number;
        username?: string;
    }>;
}

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatNumber = (num: number): string =>
    new Intl.NumberFormat('en-NG').format(num);

const WalletCard = ({ value }: { value: string }) => (
    <Card
        className="relative overflow-hidden rounded-2xl border-0 shadow-none"
        style={{
            backgroundImage: 'url("/images/wallet-bg.png")',
            backgroundColor: '#F56B08',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 110,
        }}
    >
        <CardContent className="relative z-10 p-6 flex justify-between">
            <div>
                <p className="text-[#F7CFB5] text-sm font-medium mb-1.5">Total Revenue</p>
                <p className="text-white text-3xl font-semibold tracking-tight">{value}</p>
            </div>
            <div className='p-2 bg-[#F1702D] rounded-full max-h-fit'>
                <EyeIcon className='text-white' />
            </div>
        </CardContent>
    </Card>
);

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <Card className="rounded-2xl bg-white border-0 shadow-none">
        <CardContent className="p-6">
            <p className="text-medium-gray text-sm font-medium mb-1.5">{title}</p>
            <p className="text-dark-gray text-3xl font-semibold">{value}</p>
        </CardContent>
    </Card>
);

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx, cy, midAngle, outerRadius, value, fill,
}: any) => {
    // 1. Point where line touches the pie edge
    const touchX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const touchY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    // 2. Short radial extension (~5px) before curve starts
    const radialLen = 5;
    const p1x = cx + (outerRadius + radialLen) * Math.cos(-midAngle * RADIAN);
    const p1y = cy + (outerRadius + radialLen) * Math.sin(-midAngle * RADIAN);

    // 3. Elbow point — where horizontal arm starts (~22px out from pie)
    const elbowLen = 10;
    const isRight = Math.cos(-midAngle * RADIAN) >= 0;
    const ex = cx + (outerRadius + elbowLen) * Math.cos(-midAngle * RADIAN);
    const ey = cy + (outerRadius + elbowLen) * Math.sin(-midAngle * RADIAN);

    // 4. Tip of horizontal arm (15px horizontal from elbow)
    const armLen = 70;
    const tipX = ex + (isRight ? armLen : -armLen);
    const tipY = ey;

    const textAnchor = isRight ? 'start' : 'end';
    const textX = tipX + (isRight ? 4 : -4);

    return (
        <g>
            {/* Dot where line meets pie */}
            <circle cx={touchX} cy={touchY} r={0} fill={fill} />

            {/* Path: radial nub → cubic curve → horizontal arm */}
            <path
                d={`M${touchX},${touchY} L${p1x},${p1y} C${p1x},${p1y} ${ex},${ey} ${ex},${ey} L${tipX},${tipY}`}
                stroke={fill}
                fill="none"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Number BELOW the horizontal tip */}
            <text
                x={textX}
                y={tipY + 14}
                textAnchor={textAnchor}
                fill="#212121"
                fontSize={12}
                fontWeight={600}
            >
                {formatNumber(value)}
            </text>
        </g>
    );
};

const MERCHANT_STATUS_COLORS = {
    Approved: '#018E25',
    Pending: '#F59E0B',
    Declined: '#FF383C',
};

const DonutChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className="relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height={210}>
                <PieChart margin={{ top: 40, right: 60, bottom: 40, left: 60 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}   // ← much smaller inner circle
                        outerRadius={90}  // ← thick ring
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                        labelLine={false}
                        label={renderCustomizedLabel}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [formatNumber(value as number), '']}
                        contentStyle={{ borderRadius: '15px', border: '1px solid #e5e7eb', fontSize: 10 }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute text-center pointer-events-none">
                <p className="text-2xl font-bold text-dark-gray">{formatNumber(total)}</p>
            </div>
        </div>
    );
};

const CustomRevenueDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={10} fill={fill} opacity={0.18} />
            <circle cx={cx} cy={cy} r={6} fill={fill} opacity={0.35} />
            <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={1.5} />
        </g>
    );
};

const CustomActiveRevenueDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={14} fill="#F56B08" opacity={0.15} />
            <circle cx={cx} cy={cy} r={9} fill="#F56B08" opacity={0.3} />
            <circle cx={cx} cy={cy} r={5} fill="#F56B08" stroke="#fff" strokeWidth={2} />
        </g>
    );
};

const RevenueTrendChart = ({
    data,
}: {
    data: Array<{ month_name: string; total_amount: number }>;
}) => {
    const displayData = data.filter((d) => d.month_name !== '');
    const amounts = displayData.map((d) => d.total_amount).filter((v) => v > 0);
    const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 150000;
    const yMin = minAmount > 0 ? Math.floor(minAmount / 10000) * 10000 : 0;
    const yMax = Math.ceil(maxAmount / 10000) * 10000 + 10000;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData} margin={{ top: 20, right: 24, left: 8, bottom: 10 }}>
                <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#9E9E9E"
                    horizontal={true}
                    vertical={true}
                />
                <XAxis
                    dataKey="month_name"
                    axisLine={{ stroke: '#9E9E9E', strokeWidth: 1.5 }}
                    tickLine={false}
                    tick={{ fill: '#212121', fontSize: 12 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#212121', fontSize: 12 }}
                    tickFormatter={(v) => `₦${v / 1000}k`}
                    domain={[yMin, yMax]}
                />
                <Tooltip
                    formatter={(value: any) => [formatCurrency(value as number), 'Revenue']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: 13 }}
                />
                <defs>
                    <linearGradient id="revenueLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F56B08" />
                        <stop offset="100%" stopColor="#F56B08" />
                    </linearGradient>
                </defs>
                <Line
                    type="monotone"
                    dataKey="total_amount"
                    stroke="url(#revenueLineGradient)"
                    strokeWidth={2.5}
                    dot={<CustomRevenueDot fill="#F56B08" />}
                    activeDot={<CustomActiveRevenueDot />}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const HorizontalBarChart = ({
    data,
    valuePrefix = '₦',
    showCount = false,
    countLabel = 'orders',
}: {
    data: any[];
    title?: string;
    valuePrefix?: string;
    showCount?: boolean;
    countLabel?: string;
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-medium-gray text-sm">
                No data available
            </div>
        );
    }
    const maxRevenue = Math.max(...data.map((item) => item.total_sales || item.total_spend || 0));
    return (
        <div className="space-y-3">
            {data.map((item, index) => {
                const revenue = item.total_sales || item.total_spend || 0;
                const count = item.order_count || item.delivery_count || 0;
                const pct = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                const name =
                    item.business_name || item.customer_name || item.rider_name || 'Unknown';
                return (
                    <div key={item.merchant_id || item.rider_id || item.customer_id || index} className="space-y-1.5">
                        <div className="flex justify-between items-baseline gap-2">
                            <span className="text-sm text-medium-gray font-medium truncate max-w-[55%]" title={name}>
                                {name}
                            </span>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {showCount && count > 0 && (
                                    <span className="text-[10px] text-medium-gray bg-gray-50 px-2 py-0.5 rounded-full">
                                        {formatNumber(count)} {countLabel}
                                    </span>
                                )}
                                <span className="text-sm font-semibold text-dark-gray whitespace-nowrap">
                                    {valuePrefix}{formatNumber(revenue)}
                                </span>
                            </div>
                        </div>
                        <div className="relative h-5 bg-[#FEE9DA] overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full transition-all duration-500"
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: '#F78939',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ActiveInactiveChart = ({
    merchants,
    customers,
}: {
    merchants: { active: number; inactive: number };
    customers: { active: number; inactive: number };
}) => {
    const data = [
        {
            name: 'Merchants',
            Active: merchants.active,
            Inactive: merchants.inactive,
        },
        {
            name: 'Customers',
            Active: customers.active,
            Inactive: customers.inactive,
        },
    ];
    return (
        <ResponsiveContainer width="100%" height={210}>
            <BarChart data={data} barCategoryGap="35%" barGap={4} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#212121', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#212121', fontSize: 12 }} />
                <Tooltip
                    formatter={(value: any) => [formatNumber(value as number), '']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                <Bar dataKey="Active" fill="#018E25" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Inactive" fill="#FF383C" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const TxCard = ({
    label,
    count,
    value,
    color,
}: {
    label: string;
    count: number;
    value: number;
    color: string;
}) => (
    <div
        className="rounded-xl p-4 border border-gray-100 bg-white flex flex-col gap-1 shadow-sm"
        style={{ borderLeft: `4px solid ${color}` }}
    >
        <p className="text-medium-gray text-xs font-semibold">{label}</p>
        <p className="text-dark-gray  text-lg font-bold">{formatCurrency(value)}</p>
        <p className="text-medium-gray  text-xs">{formatNumber(count)} transactions</p>
    </div>
);

const filterOptions = [
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
];

const calculateDateRange = (
    filter: string,
    customStart?: string,
    customEnd?: string
) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    const fmt = (d: Date) =>
        `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${d.getFullYear()}`;

    switch (filter) {
        case 'this_week':
            start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            end = new Date();
            break;
        case 'last_week':
            start = new Date(now);
            start.setDate(now.getDate() - now.getDay() - 7);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
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
                const [sD, sM, sY] = customStart.split('-');
                const [eD, eM, eY] = customEnd.split('-');
                start = new Date(+sY, +sM - 1, +sD);
                end = new Date(+eY, +eM - 1, +eD);
            }
            break;
        default:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();
    }
    return { startDate: fmt(start), endDate: fmt(end) };
};

const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const [day, month, year] = dateStr.split('-');
        return new Date(+year, +month - 1, +day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export default function OperationsDashboard() {
    usePageMetadata('Operations Dashboard', 'Overview of key metrics and performance indicators.')
    const { usePermissionGuard } = usePermission();
    usePermissionGuard('VIEW_DASHBOARD', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view dashboard",
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [selectedFilter, setSelectedFilter] = useState('this_year');
    const filterRef = useRef<HTMLDivElement>(null);

    const { data: dashboardData, isLoading, error, refetch } = useQuery<DashboardResponse>({
        queryKey: ['dashboard-summary', dateRange.startDate, dateRange.endDate],
        queryFn: async () => {
            const response = await axiosOperations.request({
                method: 'GET',
                url: '/store-dashboard/adminSummary',
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    entityCode: getClientIdentifiers().entityCode,
                },
            });
            return response.data;
        },
        enabled: !!dateRange.startDate && !!dateRange.endDate,
    });

    useEffect(() => {
        setDateRange(calculateDateRange('this_year'));
    }, []);

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        if (filter === 'custom') {
            setShowDatePicker(true);
            setIsFilterOpen(false);
        } else {
            setDateRange(calculateDateRange(filter));
            setIsFilterOpen(false);
        }
    };

    const handleDateRangeApply = (start: string, end: string) => {
        setDateRange({ startDate: start, endDate: end });
        setShowDatePicker(false);
        setSelectedFilter('custom');
    };

    const merchantStatusData = dashboardData?.merchantStatusBreakdown
        ? [
            { name: 'Approved', value: dashboardData.merchantStatusBreakdown.APPROVED || 0, color: MERCHANT_STATUS_COLORS.Approved },
            { name: 'Pending', value: dashboardData.merchantStatusBreakdown.PENDING || 0, color: MERCHANT_STATUS_COLORS.Pending },
            { name: 'Declined', value: dashboardData.merchantStatusBreakdown.DECLINED || 0, color: MERCHANT_STATUS_COLORS.Declined },
        ]
        : [];

    const revenueTrendData = dashboardData?.monthlyRevenueTrend || [];
    const topMerchantsData = dashboardData?.topMerchants || [];
    const topRidersData = dashboardData?.topRiders || [];
    const topCustomersData = dashboardData?.topCustomers || [];

    const txDataArray = dashboardData?.transactionValueAndVolume || [];
    const txTypes = [
        {
            label: 'Transfer',
            color: '#9200C7',
            count: txDataArray.find(t => t.tran_type === 'Transfer')?.volume || 0,
            value: txDataArray.find(t => t.tran_type === 'Transfer')?.value || 0
        },
        {
            label: 'Bill Payment',
            color: '#F59E0B',
            count: txDataArray.find(t => t.tran_type === 'Bill Payment')?.volume || 0,
            value: txDataArray.find(t => t.tran_type === 'Bill Payment')?.value || 0
        },
        {
            label: 'Data',
            color: '#018E25',
            count: txDataArray.find(t => t.tran_type === 'Data')?.volume || 0,
            value: txDataArray.find(t => t.tran_type === 'Data')?.value || 0
        },
        {
            label: 'Airtime',
            color: '#FF383C',
            count: txDataArray.find(t => t.tran_type === 'Airtime')?.volume || 0,
            value: txDataArray.find(t => t.tran_type === 'Airtime')?.value || 0
        },
    ];

    const merchants = {
        active: dashboardData?.merchantActivityBreakdown?.activeMerchants || 0,
        inactive: dashboardData?.merchantActivityBreakdown?.inactiveMerchants || 0,
    };
    const customers = {
        active: dashboardData?.customerActivityBreakdown?.activeCustomers || 0,
        inactive: dashboardData?.customerActivityBreakdown?.inactiveCustomers || 0,
    };

    if (isLoading && !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-faded-accent mx-auto" />
                    <p className="mt-3 text-gray-500 text-sm">Loading dashboard data…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-3 text-sm">Error loading dashboard data</p>
                    <Button variant="outline" onClick={() => refetch()} className="border-gray-200">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen">
                <div className="container mx-auto px-2">
                    <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            {dateRange.startDate && dateRange.endDate && (
                                <p className="text-sm font-medium text-medium-gray mt-1">
                                    Showing data from{' '}
                                    <span className="font-semibold">
                                        {formatDisplayDate(dateRange.startDate)}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-semibold">
                                        {formatDisplayDate(dateRange.endDate)}
                                    </span>
                                </p>
                            )}
                        </div>

                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-dark-gray hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-faded-accent/10"
                                style={{ minWidth: '150px' }}
                            >
                                <span className="flex-1 text-left">
                                    {filterOptions.find((o) => o.value === selectedFilter)?.label || 'Select Filter'}
                                </span>
                                <ArrowIcon
                                    className={`h-4 w-4 text-dark-gray scale-80 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                    <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg">
                                        {filterOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleFilterChange(option.value)}
                                                className={cn(
                                                    'block w-full px-4 py-2.5 text-left text-sm transition-colors',
                                                    selectedFilter === option.value
                                                        ? 'bg-faded-accent/10 text-text font-medium'
                                                        : 'text-medium-gray hover:bg-gray-50'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* {showDatePicker && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[680px] max-w-[95vw]">
                                <h3 className="text-base font-semibold text-dark-gray mb-4">Select Date Range</h3>
                                <DateRangePicker
                                    onApply={handleDateRangeApply}
                                    onCancel={() => setShowDatePicker(false)}
                                    initialStartDate={dateRange.startDate}
                                    initialEndDate={dateRange.endDate}
                                />
                            </div>
                        </div>
                    )} */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                        <WalletCard value={formatCurrency(dashboardData?.totalRevenue || 0)} />
                        <StatCard title="Total Users" value={formatNumber(dashboardData?.totalUsers || 0)} />
                        <StatCard title="Total Merchants" value={formatNumber(dashboardData?.totalMerchants || 0)} />
                        <StatCard title="Total Riders" value={formatNumber(dashboardData?.totalRiders || 0)} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-6">
                        <StatCard title="Order Volume" value={formatNumber(dashboardData?.orderVolumeSummary?.order_volume || 0)} />
                        <StatCard title="Active Merchants" value={formatNumber(merchants.active)} />
                        <StatCard title="Inactive Merchants" value={formatNumber(merchants.inactive)} />
                        <StatCard title="Active Customers" value={formatNumber(customers.active)} />
                        <StatCard title="Inactive Customers" value={formatNumber(customers.inactive)} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Merchant Status
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Distribution of merchant approval status
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                {merchantStatusData.some((s) => s.value > 0) ? (
                                    <>
                                        <DonutChart data={merchantStatusData} />
                                        <div className="flex justify-center gap-6 mt-4">
                                            {merchantStatusData.map((s) => (
                                                <div key={s.name} className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                                    <span className="text-xs text-dark-gray">{s.name}</span>
                                                    {/* <span className="text-xs font-semibold text-gray-700">{formatNumber(s.value)}</span> */}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-64 text-medium-gray text-sm">
                                        No data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Revenue Trend
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">Monthly revenue performance</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                {revenueTrendData.some((r) => r.total_amount > 0) ? (
                                    <RevenueTrendChart data={revenueTrendData} />
                                ) : (
                                    <div className="flex items-center justify-center h-64 text-medium-gray text-sm">
                                        No revenue data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Active vs Inactive
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Merchants and customers engagement breakdown
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ActiveInactiveChart merchants={merchants} customers={customers} />
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Transaction Value &amp; Volume
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Transfer · Bill Payment · Data · Airtime
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {txTypes.map((tx) => (
                                        <TxCard
                                            key={tx.label}
                                            label={tx.label}
                                            count={tx.count}
                                            value={tx.value}
                                            color={tx.color}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Top Merchants by Revenue
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Highest earning merchants in selected period
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <HorizontalBarChart data={topMerchantsData} showCount={true} countLabel="orders" />
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-0 shadow-sm bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Top Riders by Revenue
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Highest earning riders in selected period
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <HorizontalBarChart
                                    data={topRidersData.map((rider) => ({
                                        rider_name: rider.fullname || rider.rider_name,
                                        rider_id: rider.rider_id || rider.username,
                                        total_sales: rider.total_revenue || rider.total_sales || 0,
                                        delivery_count: rider.delivery_count || 0,
                                    }))}
                                    showCount={true}
                                    countLabel="deliveries"
                                />
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-0 bg-white shadow-none">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-md font-semibold text-dark-gray">
                                    Top Customers
                                </CardTitle>
                                <p className="text-xs text-medium-gray -mt-1">
                                    Highest spending customers in selected period
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <HorizontalBarChart
                                    data={topCustomersData.map((c) => ({
                                        customer_name: c.customer_name,
                                        customer_id: c.customer_id,
                                        total_spend: c.total_spend,
                                        order_count: c.order_count
                                    }))}
                                    showCount={true}
                                    countLabel="orders"
                                    valuePrefix="₦"
                                />
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}