import React, { useState } from 'react';

export const DataTable = ({ columns, data, emptyMessage = 'No data available', onRowClick }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center rounded-sm" style={{ backgroundColor: '#0F141A', border: '1px solid #1E293B' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm overflow-hidden" style={{ backgroundColor: '#0F141A', border: '1px solid #1E293B' }}>
      <div className="overflow-x-auto">
        <table className="w-full table-dense" style={{ 
          fontSize: '13px',
          tableLayout: 'auto',
          width: '100%'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1E293B', backgroundColor: '#0B0F14' }}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                  style={{ 
                    width: column.width,
                    minWidth: column.width,
                    color: '#6B7280',
                    fontSize: '11px',
                    letterSpacing: '0.05em'
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b transition-all duration-150 cursor-pointer"
                style={{ 
                  borderColor: '#162030',
                  borderBottomWidth: '1px',
                  height: '36px',
                  backgroundColor: selectedRow === rowIndex ? 'rgba(90, 159, 107, 0.08)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedRow !== rowIndex) {
                    e.currentTarget.style.backgroundColor = 'rgba(90, 159, 107, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRow !== rowIndex) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => {
                  setSelectedRow(rowIndex);
                  if (onRowClick) onRowClick(row);
                }}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="px-3 py-2"
                    style={{ 
                      color: '#9CA3AF',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={row[column.key]}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
