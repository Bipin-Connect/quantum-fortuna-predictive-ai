import React from 'react';

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export function Table({ className = '', children }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function TableHeader({ className = '', children }: TableHeaderProps) {
  return (
    <thead className={`border-b border-gray-700 ${className}`}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function TableBody({ className = '', children }: TableBodyProps) {
  return (
    <tbody className={`${className}`}>
      {children}
    </tbody>
  );
}

interface TableFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function TableFooter({ className = '', children }: TableFooterProps) {
  return (
    <tfoot className={`border-t border-gray-700 ${className}`}>
      {children}
    </tfoot>
  );
}

interface TableRowProps {
  className?: string;
  children: React.ReactNode;
}

export function TableRow({ className = '', children }: TableRowProps) {
  return (
    <tr className={`border-b border-gray-800 transition-colors hover:bg-gray-800/50 ${className}`}>
      {children}
    </tr>
  );
}

interface TableHeadProps {
  className?: string;
  children: React.ReactNode;
}

export function TableHead({ className = '', children }: TableHeadProps) {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-300 ${className}`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  className?: string;
  children: React.ReactNode;
}

export function TableCell({ className = '', children }: TableCellProps) {
  return (
    <td className={`p-4 align-middle ${className}`}>
      {children}
    </td>
  );
}

interface TableCaptionProps {
  className?: string;
  children: React.ReactNode;
}

export function TableCaption({ className = '', children }: TableCaptionProps) {
  return (
    <caption className={`mt-4 text-sm text-gray-400 ${className}`}>
      {children}
    </caption>
  );
}