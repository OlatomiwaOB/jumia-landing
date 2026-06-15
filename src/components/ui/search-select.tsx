"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchableSelectProps {
    options: Array<{ value: string; label: string }>
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    isLoading?: boolean
    loadingMessage?: string
    emptyMessage?: string
}

export function SearchSelect({
    options,
    value,
    onValueChange,
    placeholder = "Select...",
    disabled = false,
    isLoading = false,
    loadingMessage = "Loading...",
    emptyMessage = "No options found"
}: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 0)
        } else {
            setSearchTerm('')
        }
    }, [open])

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm])

    return (
        <Select
            value={value}
            onValueChange={(newValue) => {
                onValueChange(newValue)
                setSearchTerm('')
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectTrigger disabled={disabled} className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="sticky top-0 z-10 bg-white px-2 pt-2 pb-1 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-8 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <div className="max-h-[200px] overflow-y-auto">
                    {isLoading ? (
                        <SelectItem value="loading" disabled>{loadingMessage}</SelectItem>
                    ) : filteredOptions.length === 0 ? (
                        <SelectItem value="empty" disabled>{emptyMessage}</SelectItem>
                    ) : (
                        filteredOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))
                    )}
                </div>
            </SelectContent>
        </Select>
    )
}