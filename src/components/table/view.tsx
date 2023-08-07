import './styles.scss'

import { Column } from './models'
import { ReorderableColumn, useColumnReorder } from './useColumnReorder'
import { useSort } from './useSort'

type Props<T extends { id: string }> = {
  data: T[]
  columns: Column<T>[]
}

export function Table<T extends { id: string }>({ data, columns }: Props<T>) {
  const {
    isEnabled: isReordering,
    button: reorderButton,
    reorder,
    orderedColumns,
  } = useColumnReorder(columns)
  const { sortBy, renderSortIcon, sortedData } = useSort<T>(data)

  return (
    <div className="table-wrapper">
      <section className="toolbar">
        <section className="result-count">{data.length} results</section>
        <section className="tools">
          {!isReordering && <p>Click on column headers to sort.</p>}
          {reorderButton}
        </section>
      </section>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {orderedColumns.map((col, i) => (
                <ReorderableColumn
                  key={col.name}
                  onClick={() => sortBy(col)}
                  index={i}
                  isReordering={isReordering}
                  reorder={reorder}
                >
                  {col.name}
                  {renderSortIcon(col.propertyKey)}
                </ReorderableColumn>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr key={row.id}>
                {orderedColumns.map((col) => (
                  <td
                    key={`${row.id}-${col.name}`}
                    style={col.centerText ? { textAlign: 'center' } : undefined}
                  >
                    {col.render?.(row) ?? `${row[col.propertyKey]}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
