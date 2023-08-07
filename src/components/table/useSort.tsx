import { useCallback, useEffect, useRef, useState } from 'react'
import {
  TiArrowSortedUp as SortUpIcon,
  TiArrowSortedDown as SortDownIcon,
} from 'react-icons/ti'

import { Column } from './models'

export function useSort<T>(data: T[]) {
  const [columnId, setColumnId] = useState<keyof T>()
  const [isAscending, setIsAscending] = useState<boolean>(true)
  const sortFunc = useRef<(data: T[], isAscending: boolean) => T[]>()
  const [sortedData, setSortedData] = useState<T[]>(data)

  const doSort = useCallback(
    (data: T[], columnId: keyof T, isAscending: boolean) => {
      if (sortFunc.current) {
        setSortedData(sortFunc.current(data.slice(), isAscending))
      } else {
        setSortedData(
          data.slice().sort((a, b) => {
            const aProperty = a[columnId] as string
            const bProperty = b[columnId] as string
            return isAscending
              ? aProperty.localeCompare(bProperty)
              : bProperty.localeCompare(aProperty)
          })
        )
      }
    },
    []
  )

  useEffect(() => {
    if (columnId === undefined) return
    doSort(data, columnId, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columnId])

  useEffect(() => {
    if (columnId === undefined) return
    doSort(data, columnId, isAscending)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isAscending])

  function sortBy(column: Column<T>) {
    if (column.propertyKey === columnId) {
      setIsAscending((v) => !v)
    } else {
      setColumnId(column.propertyKey)
      setIsAscending(true)
      sortFunc.current = column.sort
    }
  }

  function renderSortIcon(columnPropertyKey: keyof T) {
    if (columnId !== columnPropertyKey) return
    return isAscending ? <SortUpIcon /> : <SortDownIcon />
  }

  return { sortBy, renderSortIcon, sortedData }
}
