// src/components/ui/Table.tsx
import React from 'react';

interface TableColumn<T> {
  title: string;
  key: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: T) => void;
  className?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = 'Nenhum dado encontrado',
  onRowClick,
  className = '',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey]?.toString() || index.toString();
  };

  const getCellValue = (record: T, column: TableColumn<T>, index: number) => {
    if (column.render) {
      return column.render(record[(column.key as keyof T)], record, index);
    }
    return record[(column.key as keyof T)];
  };
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th 
                key={idx}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, idx) => (
              <tr 
                key={getRowKey(record, idx)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => onRowClick && onRowClick(record)}
              >
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                    {getCellValue(record, column, idx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;