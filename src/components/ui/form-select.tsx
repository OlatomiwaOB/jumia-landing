// components/ui/form-select.tsx
"use client"

import * as React from "react"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FormSelectProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label?: string
    placeholder?: string
    options: Array<{ id: string; name: string }>
    required?: boolean
    rules?: any
    className?: string
    triggerClassName?: string
    onChange?: (value: string) => void
}

export function FormSelect<T extends FieldValues>({
    name,
    control,
    label,
    placeholder = "Select an option",
    options,
    required = false,
    rules,
    className,
    triggerClassName,
    onChange,
}: FormSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules || (required ? { required: 'This field is required' } : undefined)}
            render={({ field: { onChange: fieldOnChange, value, ref }, fieldState: { error } }) => (
                <div className="space-y-2">
                    {label && (
                        <label htmlFor={name} className="text-sm font-medium">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    <Select
                        value={value || undefined}
                        onValueChange={(newValue) => {
                            fieldOnChange(newValue)
                            onChange?.(newValue)
                        }}
                    >
                        <SelectTrigger
                            className={triggerClassName}
                            id={name}
                            ref={ref}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className={className}>
                            <SelectGroup>
                                {options.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {error && (
                        <p className="text-red-500 text-xs">{error.message}</p>
                    )}
                </div>
            )}
        />
    )
}