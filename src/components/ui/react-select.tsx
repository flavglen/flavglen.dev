"use client"

import React from "react"
import Select, { StylesConfig, GroupBase } from "react-select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

interface ReactSelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  isSearchable?: boolean
  isClearable?: boolean
}

export function ReactSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  isSearchable = false,
  isClearable = false,
}: ReactSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null

  const customStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
      "&:hover": {
        borderColor: "hsl(var(--ring))",
      },
      backgroundColor: "hsl(var(--background))",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "hsl(var(--popover))",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
        ? "hsl(var(--accent))"
        : "transparent",
      color: state.isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "hsl(var(--accent))",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (base) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
    }),
    input: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
    }),
  }

  return (
    <Select<SelectOption>
      options={options}
      value={selectedOption}
      onChange={(newValue) => {
        onChange(newValue?.value || "")
      }}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={isClearable}
      className={cn("react-select-container", className)}
      classNamePrefix="react-select"
      styles={customStyles}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  )
}
