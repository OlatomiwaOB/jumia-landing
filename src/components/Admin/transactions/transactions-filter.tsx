'use client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import React, { useState } from 'react'

const statusOptions = [
    {id: 'all', label: 'All Status'},
    {id: 'SUCCESS', label: 'Success'},
    {id: 'PENDING', label: 'Pending'},
    {id: 'FAILED', label: 'Failed'}
]

interface TransactionsFilterProps {
  onFilterChange: (filters: {
    searchTerm: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
}

const TransactionsFilter = ({ onFilterChange }: TransactionsFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const clearFilters = () => {
    setSearchTerm('')
    setStatus('all')
    setStartDate('')
    setEndDate('')
    onFilterChange({
      searchTerm: '',
      status: 'all',
      startDate: '',
      endDate: ''
    })
  }

  const applyFilters = () => {
    if (window.innerWidth < 1024) {
      setIsFilterOpen(false)
    }
    
    onFilterChange({
      searchTerm,
      status,
      startDate,
      endDate
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters()
    }
  }

  return (
    <>
      <div className="flex lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      <div className={`
        bg-gray-50 rounded-lg border transition-all duration-200 ease-in-out
        ${isFilterOpen ? 'block' : 'hidden'} lg:block
      `}>
        <div className="p-4 space-y-4 lg:space-y-0">

          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">

            <div className="flex-1 max-w-md">
              <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
                  placeholder="Search by transaction ID."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[140px] bg-white"
                />
                <span className="px-1">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[140px] bg-white"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={applyFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent border border-accent/60 rounded-lg hover:bg-accent/70 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 lg:hidden">

            <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
                placeholder="Search by transaction ID..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white"
                    placeholder="From date"
                  />
                </div>
                <div className="flex items-center justify-center sm:px-2">
                  <span className="text-sm text-gray-500">to</span>
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white"
                    placeholder="To date"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={clearFilters}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={applyFilters}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent border border-accent rounded-lg hover:bg-accent/70 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionsFilter