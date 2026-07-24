"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface Option {
  id: string;
  name: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedValues = Array.isArray(value) ? value : [];

  const toggleOption = (optionValue: string) => {
    const isSelected = selectedValues.includes(optionValue);
    const nextValue = isSelected
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(nextValue);
  };

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== optionValue));
  };

  const getOptionLabel = (val: string) => {
    const match = options.find((opt) => opt.id === val || opt.name === val);
    return match ? match.name : val;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 px-3 py-2 text-left font-normal bg-white border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-sidebar-accent",
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5 items-center max-w-[90%]">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => (
                <Badge
                  key={val}
                  variant="secondary"
                  className="bg-sidebar-accent/20 text-dark-gray border border-sidebar-accent/20 hover:bg-sidebar-accent/20 gap-1 py-0.5 px-2 text-xs font-normal"
                >
                  <span>{getOptionLabel(val)}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeOption(e, val)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        removeOption(e as any, val);
                      }
                    }}
                    className="cursor-pointer hover:text-red-500 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-medium-gray text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search preferences..." className="h-9" />
          <CommandList className="max-h-60 overflow-y-auto p-1">
            <CommandEmpty>No preference found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optVal = option.id || option.name;
                const isSelected = selectedValues.includes(optVal) || (option.id && selectedValues.includes(option.id)) || (option.name && selectedValues.includes(option.name));
                return (
                  <CommandItem
                    key={optVal}
                    value={option.name + " " + (option.id || "")}
                    onSelect={() => toggleOption(optVal)}
                    className="cursor-pointer flex items-center justify-between py-2 px-3 hover:bg-gray-100 rounded"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-dark-gray font-medium">{option.name}</span>
                      {option.description && (
                        <span className="text-xs text-medium-gray">{option.description}</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
