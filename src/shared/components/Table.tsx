"use client";

import { ReactNode } from 'react';

// Table Container
interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
}

// Table Head
interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return <thead className="bg-gray-50">{children}</thead>;
}

// Table Body
interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

// Table Row
interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  isClickable?: boolean;
  isSelected?: boolean;
}

export function TableRow({ children, onClick, isClickable = false, isSelected = false }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        ${isClickable ? 'cursor-pointer' : ''}
        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
        transition-colors
      `}
    >
      {children}
    </tr>
  );
}

// Table Header Cell
interface TableHeaderCellProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function TableHeaderCell({ children, align = 'left', className = '' }: TableHeaderCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={`
        px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
        ${alignStyles[align]}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

// Table Cell
interface TableCellProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function TableCell({ children, align = 'left', className = '' }: TableCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`
        px-6 py-4 whitespace-nowrap text-sm
        ${alignStyles[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

// Empty State para tablas
interface TableEmptyStateProps {
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  colSpan?: number;
}

export function TableEmptyState({
  message = 'No hay datos disponibles',
  icon,
  action,
  colSpan = 5,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <p className="text-gray-500">{message}</p>
        {action && <div className="mt-4">{action}</div>}
      </td>
    </tr>
  );
}
