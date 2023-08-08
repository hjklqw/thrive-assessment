import { renderHook, act } from '@testing-library/react'
import {
  TiArrowSortedUp as SortUpIcon,
  TiArrowSortedDown as SortDownIcon,
} from 'react-icons/ti'

import { useSort } from './useSort'
import { Column } from './models'

type Data = {
  id: number
  value: string
}

const data: Data[] = [
  { id: 20, value: 'b' },
  { id: 21, value: 'c' },
  { id: 2, value: 'a' },
]

/**
 * Uses a sorting function that:
 * - Does nothing when ascending
 * - Simply reverses the array when descending
 */
const idColumn: Column<Data> = {
  name: 'ID',
  propertyKey: 'id',
  sort: (data, isAscending) => {
    if (isAscending) {
      return data
    }
    return data.reverse()
  },
}
const valueColumn: Column<Data> = {
  name: 'Value',
  propertyKey: 'value',
}

describe('Table component - useSort', () => {
  describe('sortBy()', () => {
    it('should sort by the given column, ascending', () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(valueColumn))
      expect(result.current.sortedData).toEqual([
        { id: 2, value: 'a' },
        { id: 20, value: 'b' },
        { id: 21, value: 'c' },
      ])
    })

    it('should sort by the given column, descending, when said column has already been sorted by', () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(valueColumn))
      act(() => result.current.sortBy(valueColumn))
      expect(result.current.sortedData).toEqual([
        { id: 21, value: 'c' },
        { id: 20, value: 'b' },
        { id: 2, value: 'a' },
      ])
    })

    it("should sort using the given column's sorting function, ascending", () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(idColumn))
      expect(result.current.sortedData).toEqual(data)
    })

    it("should sort using the given column's sorting function, descending, when said column has already been sorted by", () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(idColumn))
      act(() => result.current.sortBy(idColumn))
      expect(result.current.sortedData).toEqual(data.slice().reverse())
    })
  })

  describe('renderSortIcon()', () => {
    it('should render nothing when the column is not being sorted by', () => {
      const { result } = renderHook(() => useSort(data))
      expect(
        result.current.renderSortIcon(valueColumn.propertyKey)
      ).toBeUndefined()
    })

    it('should render the up icon when the column is sorted ascending', () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(valueColumn))
      expect(result.current.renderSortIcon(valueColumn.propertyKey)).toEqual(
        <SortUpIcon />
      )
    })

    it('should render the down icon when the column is sorted descending', () => {
      const { result } = renderHook(() => useSort(data))
      act(() => result.current.sortBy(valueColumn))
      act(() => result.current.sortBy(valueColumn))
      expect(result.current.renderSortIcon(valueColumn.propertyKey)).toEqual(
        <SortDownIcon />
      )
    })
  })
})
