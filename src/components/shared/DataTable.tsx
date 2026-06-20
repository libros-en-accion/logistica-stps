'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  FileDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  emptyMessage?: string
  actions?: React.ReactNode
  onExport?: () => void
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  onSearch,
  emptyMessage = 'No se encontraron registros',
  actions,
  onExport,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIcon({ column }: { column: Column<T> }) {
    if (!column.sortable) return null
    if (sortKey !== column.key) return <ChevronsUpDown className="ml-1 h-3 w-3" />
    return sortDir === 'asc' ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    )
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null) return 1
    if (bVal == null) return -1
    const cmp = String(aVal).localeCompare(String(bVal), 'es', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="space-y-4">
      {(searchable || actions || onExport) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {actions}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <FileDown className="mr-1 h-3 w-3" /> Exportar
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.sortable && 'cursor-pointer select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center">
                    {col.label}
                    <SortIcon column={col} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((item, i) => (
                <TableRow key={(item.id as string) ?? i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item)
                        : (item[col.key] as React.ReactNode) ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
