'use client'
import React, { useState, ChangeEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosOperations from '@/utils/fetch-function-op-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Search, X, Eye, CheckCircle2, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import PrivateRoute from '@/utils/private-route'
import BulkActionButtons from '@/components/Operations/maker-checker/bulk-actions-buttons'
import BulkActionModal from '@/components/Operations/maker-checker/bulk-actions-modal'
import Link from 'next/link'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import { TransInflowIcon, SeperatorIcon } from '@/components/icons/icons'
import Papa from 'papaparse'
import { toast } from 'sonner'

export type MakerCheckerFilterItems = {
    searchTerm: string
    startDate: string
    endDate: string
    createdBy: string
}

const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        case 'approved': case 'y': return 'bg-green-100 text-green-700 border-green-200'
        case 'rejected': case 'n': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
}

const TablePagination = ({
    current, total, perPage, onChange,
}: { current: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage)
    const start = (current - 1) * perPage + 1
    const end = Math.min(current * perPage, total)

    const getPageNumbers = () => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1)
        const result: (number | '...')[] = []
        if (current <= 3) result.push(1, 2, 3, '...', pages)
        else if (current >= pages - 2) result.push(1, '...', pages - 2, pages - 1, pages)
        else result.push(1, '...', current, '...', pages)
        return result
    }

    return (
        <div className="flex items-center justify-between mt-4 pt-4 mb-10">
            <p className="text-sm text-dark-gray">Showing {start}–{end} of {total} Items per Page</p>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current - 1)} disabled={current === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`e-${i}`} className="text-xs text-gray-400 px-1">···</span>
                    ) : (
                        <button key={p} onClick={() => onChange(p as number)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === current ? 'border-2 border-orange-400 text-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {p}
                        </button>
                    )
                )}
                <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onChange(current + 1)} disabled={current === pages}>
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

const MakerCheckerPage = () => {
    usePageMetadata('Maker Checker', 'View and manage pending approvals')

    const [filterTrigger, setFilterTrigger] = useState(0)
    const [page, setPage] = useState(1)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)

    const [filterItems, setFilterItems] = useState<MakerCheckerFilterItems>({
        searchTerm: '',
        startDate: '',
        endDate: '',
        createdBy: '',
    })

    const getFirstDayOfYear = () => {
        const year = new Date().getFullYear()
        return `01-01-${year}`
    }

    const today = new Date().toISOString().split('T')[0]
    const firstDayOfYear = getFirstDayOfYear()

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['maker-checker-list', filterTrigger, page],
        queryFn: () => axiosOperations.request({
            url: '/makerChecker/getPendingMakerChecker',
            method: 'GET',
            params: {
                searchTerm: filterItems?.searchTerm,
                startDate: filterItems?.startDate || firstDayOfYear,
                endDate: filterItems?.endDate || today,
                createdBy: filterItems?.createdBy,
                // pageNumber: page,
                pageNumber: 1,
                pageSize: 5000
            }
        })
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setFilterItems({ ...filterItems, [name]: value })
    }

    const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
        setFilterItems(prev => ({ ...prev, [key]: value }))
    }

    const handleApplyFilter = () => {
        setFilterTrigger(prev => prev + 1)
        setPage(1)
        setSelectedItems([])
    }

    const handleClearFilters = () => {
        setFilterItems({ searchTerm: '', startDate: '', endDate: '', createdBy: '' })
        setFilterTrigger(prev => prev + 1)
        setPage(1)
        setSelectedItems([])
    }

    const handleSelectAll = (checked: boolean) => {
        const items = Array.isArray(data?.data) ? data.data : []
        if (checked && items) {
            setSelectedItems(items.map((item: any) => item.id.toString()))
        } else {
            setSelectedItems([])
        }
    }

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, id])
        } else {
            setSelectedItems(prev => prev.filter(itemId => itemId !== id))
        }
    }

    const [bulkActionData, setBulkActionData] = useState<{
        action: 'approve' | 'reject' | null
        selectedItems: string[]
    }>({
        action: null,
        selectedItems: []
    })

    const handleBulkAction = (action: 'approve' | 'reject') => {
        setBulkActionData({
            action,
            selectedItems: selectedItems
        })
    }

    const handleBulkSuccess = () => {
        setSelectedItems([])
        setFilterTrigger(prev => prev + 1)
    }

    const items = Array.isArray(data?.data) ? data.data : []
    const totalCount = data?.data?.totalCount || items.length
    const totalPages = data?.data?.totalPage || Math.ceil(totalCount / 10)

    const exportToCSV = () => {
        if (!items.length) { toast.error('No data to export'); return }
        const csv = Papa.unparse(items.map((item: any) => ({
            'Activity Ref': item.activityRef,
            'Domain Type': item.domainType,
            'Activity': item.activityTitle,
            'Created By': item.createdBy,
            'Created Date': item.createdDate,
            'Status': item.verifyStatus,
        })), { header: true })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }))
        link.download = `maker-checker-${new Date().toISOString().split('T')[0]}.csv`
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Export complete')
    }

    const hasActiveFilters = filterItems.searchTerm || filterItems.createdBy ||
        filterItems.startDate || filterItems.endDate

    return (
        <div className="min-h-screen px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <p className="text-sm text-medium-gray mb-1">Total Pending</p>
                    <p className="text-2xl font-semibold text-dark-gray">{totalCount.toLocaleString()}</p>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedItems.length > 0 && (
                <BulkActionButtons
                    selectedCount={selectedItems.length}
                    onApprove={() => handleBulkAction('approve')}
                    onReject={() => handleBulkAction('reject')}
                />
            )}

            {/* Filter Bar */}
            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                            name="searchTerm"
                            value={filterItems.searchTerm}
                            onChange={handleChange}
                            placeholder="Search by reference or activity..."
                            className="pl-9 text-medium-gray"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-36">
                            <DatePicker
                                value={filterItems.startDate}
                                onChange={(v) => handleDateChange('startDate', v)}
                                placeholder="Start date"
                            />
                        </div>
                        <div className="w-36">
                            <DatePicker
                                value={filterItems.endDate}
                                onChange={(v) => handleDateChange('endDate', v)}
                                placeholder="End date"
                            />
                        </div>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1 text-xs">
                                <X className="w-3.5 h-3.5" /> Clear
                            </Button>
                        )}

                        <SeperatorIcon />
                        <Button onClick={exportToCSV} size="lg" variant="outline">
                            <TransInflowIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button onClick={handleApplyFilter} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-dark-gray">
                            Pending Approvals
                        </CardTitle>
                        {/* <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                        </Button> */}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                        </div>
                    ) : isError ? (
                        <div className="flex items-center justify-center py-20 text-red-400 text-sm">Error loading data</div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <p className="text-2xl font-medium text-dark-gray">No pending items</p>
                            <p className="text-sm text-medium-gray">All approvals have been processed</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto bg-white rounded-2xl overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-[#EEEEEE]">
                                            <th className="text-left px-3 py-3 text-sm font-semibold text-dark-gray w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length === items.length && items.length > 0}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                />
                                            </th>
                                            {['S/N', 'Activity Ref', 'Domain Type', 'Activity', 'Created Date', 'Status', ''].map((h) => (
                                                <th key={h} className="text-left px-3 py-3 text-sm font-semibold text-dark-gray">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item: any, idx: number) => (
                                            <tr key={item.id}
                                                className={`border-b-2 border-[#EEEEEE] hover:bg-orange-50/40 transition-colors ${idx === items.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item.id.toString())}
                                                        onChange={(e) => handleSelectItem(item.id.toString(), e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                    />
                                                </td>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{(page - 1) * 10 + idx + 1}</p></td>
                                                <td className="px-3 py-3.5"><p className="text-sm font-mono font-medium text-dark-gray">{item.activityRef || 'N/A'}</p></td>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{item.domainType || 'N/A'}</p></td>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray max-w-[200px] truncate">{item.activityTitle || 'N/A'}</p></td>
                                                <td className="px-3 py-3.5"><p className="text-sm text-dark-gray">{item.createdDate || 'N/A'}</p></td>
                                                <td className="px-3 py-3.5">
                                                    <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium ${getStatusColor(item.verifyStatus)}`}>
                                                        {item.verifyStatus || 'PENDING'}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/operations/maker-checker/${(item.id.toString())}`}>
                                                        <Button size="xs" variant="action" title="View Details">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <TablePagination current={page} total={totalCount} perPage={10} onChange={setPage} />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {bulkActionData.action && (
                <BulkActionModal
                    action={bulkActionData.action}
                    selectedCount={bulkActionData.selectedItems.length}
                    selectedItems={bulkActionData.selectedItems}
                    itemsData={items}
                    onSuccess={handleBulkSuccess}
                    onClose={() => setBulkActionData({ action: null, selectedItems: [] })}
                    isOpen={!!bulkActionData.action}
                />
            )}
        </div>
    )
}

export default MakerCheckerPage