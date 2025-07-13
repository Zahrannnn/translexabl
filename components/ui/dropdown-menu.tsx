import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50",
          className
        )}>
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function DropdownMenuItem({ onClick, children, className, icon }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        className
      )}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </div>
  )
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
} 