'use client'

import {useEffect, useState} from 'react';
import {type Table} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Filter} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export interface DataTableFilterOption {
  column: string;
  options: string[];
}

interface DataTableFiltersProps<T> {
  table: Table<T>;
  name: string;
  filters: DataTableFilterOption[];
}

export function DataTableFilters<T>(
  {
    table,
    name,
    filters
  }: DataTableFiltersProps<T>
) {
  const {t} = useTranslation();

  const loadFilters = (): Record<string, string | undefined> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(`table_${name}_filters`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const [selectedValues, setSelectedValues] = useState<Record<string, string | undefined>>(loadFilters);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`table_${name}_filters`, JSON.stringify(selectedValues));
  }, [selectedValues, name]);

  useEffect(() => {
    filters.forEach(filter => {
      const column = table.getColumn(filter.column);
      if (!column) {
        return;
      }
      const value = selectedValues[filter.column];
      column.setFilterValue(value === 'EMPTY' ? undefined : value);
    });
  }, [filters, selectedValues, table]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="mr-3">
          <Filter/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 space-y-2 w-64">
        {filters.map(filter => {
          const column = table.getColumn(filter.column);
          if (!column) {
            return null;
          }
          return (
            <div key={filter.column} className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {typeof column.columnDef.header === "string" ?
                  t(column.columnDef.header) : null}
              </span>
              <Select
                value={selectedValues[filter.column]}
                onValueChange={(val) => {
                  setSelectedValues(prev => ({ ...prev, [filter.column]: val }));
                  const column = table.getColumn(filter.column);
                  if (!column) {
                    return;
                  }
                  if (!val || val === 'EMPTY') {
                    column.setFilterValue(undefined);
                  } else {
                    column.setFilterValue(val);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('table.filter.placeholder')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPTY">{t('table.filter.empty')}</SelectItem>
                  {filter.options.map(option => (
                    <SelectItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
