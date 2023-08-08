import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { BiMoveHorizontal as ReorderIcon } from 'react-icons/bi'

import { Column } from './models'
import { columnOrderAtom } from '../../state/columnOrders'
import { isLoggedInAtom } from '../../state/session'

export function useColumnReorder<T>(columns: Column<T>[]) {
  const [isEnabled, setEnabled] = useState<boolean>(false)
  const [orderedColumns, setOrderedColumns] = useState<Column<T>[]>(columns)
  const [stateColumnOrders, saveColumnOrdersToState] =
    useRecoilState(columnOrderAtom)
  const prevStateColumnOrdersExist = useRef<boolean>()
  const justReordered = useRef<boolean>(false)
  const isLoggedIn = useRecoilValue(isLoggedInAtom)

  useEffect(() => {
    if (justReordered.current) {
      justReordered.current = false
      return
    }

    if (!isLoggedIn) return

    if (stateColumnOrders) {
      const ordered = stateColumnOrders
        .map((name) => columns.find((c) => c.name === name))
        .filter((c) => c !== undefined) as Column<T>[]
      if (ordered.length < columns.length) {
        const unusedColumns = columns.filter((c) => !ordered.includes(c))
        setOrderedColumns([...ordered, ...unusedColumns])
      } else {
        setOrderedColumns(ordered)
      }
      prevStateColumnOrdersExist.current = true
    } else if (prevStateColumnOrdersExist.current) {
      prevStateColumnOrdersExist.current = false
      setOrderedColumns(columns)
    }
  }, [isLoggedIn, columns, stateColumnOrders])

  const button = useMemo(
    () => (
      <button
        onClick={() => setEnabled((v) => !v)}
        className={isEnabled ? 'active' : undefined}
        aria-pressed={isEnabled}
        data-testid="reorder-toggle-button"
      >
        <ReorderIcon />
        <span>Reorder</span>
      </button>
    ),
    [isEnabled]
  )

  /** Moves a column from the specified `fromIndex` to before the `toIndex`. */
  function reorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    setOrderedColumns((cols) => {
      const fromColumn = cols[fromIndex]
      const colsWithoutFromColumn = [
        ...cols.slice(0, fromIndex),
        ...cols.slice(fromIndex + 1),
      ]
      const retVal = [
        ...colsWithoutFromColumn.slice(0, toIndex),
        fromColumn,
        ...colsWithoutFromColumn.slice(toIndex),
      ]
      justReordered.current = true
      saveColumnOrdersToState(retVal.map((c) => c.name))
      return retVal
    })
  }

  return {
    isEnabled,
    button,
    reorder,
    orderedColumns,
  }
}

type ReorderableColumnProps = {
  isReordering: boolean
  index: number
  children: React.ReactNode
  reorder: (fromIndex: number, toIndex: number) => void
} & React.ThHTMLAttributes<HTMLTableCellElement>

const enum DragOverPosition {
  NONE,
  BEFORE,
  AFTER,
}

export function ReorderableColumn({
  isReordering,
  index,
  onClick: customOnClick,
  children,
  reorder,
  ...props
}: ReorderableColumnProps) {
  const [isDragging, setDragging] = useState<boolean>(false)
  const [currPos, setCurrPos] = useState<number>()
  const startPos = useRef<number>(0)
  const [draggedOverPos, setDraggedOverPos] = useState<DragOverPosition>(
    DragOverPosition.NONE
  )
  const prevMouseX = useRef<number>()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
      if (customOnClick && !isReordering) {
        customOnClick(e)
      }
    },
    [customOnClick, isReordering]
  )

  const startReorder = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setDragImage(new Image(), 0, 0)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', index.toString())
      startPos.current = e.clientX
      setDragging(true)
    },
    [index]
  )

  const updatePosition = useCallback((e: React.DragEvent) => {
    setCurrPos(e.clientX - startPos.current)
  }, [])

  const endReorder = useCallback((e: React.MouseEvent) => {
    setDragging(false)
    setCurrPos(undefined)
  }, [])

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (isDragging) return
      e.preventDefault()
      const mouseX = e.clientX
      if (prevMouseX.current === mouseX) return
      prevMouseX.current = mouseX
      const bounds = e.currentTarget.getBoundingClientRect()
      const halfwayPoint = bounds.left + bounds.width / 2
      setDraggedOverPos(
        mouseX < halfwayPoint ? DragOverPosition.BEFORE : DragOverPosition.AFTER
      )
    },
    [isDragging]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
      const isMovingLeft = fromIndex > index
      if (draggedOverPos === DragOverPosition.BEFORE) {
        reorder(fromIndex, isMovingLeft ? index : index - 1)
      } else {
        reorder(fromIndex, isMovingLeft ? index + 1 : index)
      }
      setDraggedOverPos(DragOverPosition.NONE)
    },
    [index, draggedOverPos, reorder]
  )

  const classNames = useMemo(() => {
    const classes = {
      dragging: isDragging,
      draggable: isReordering,
      'dragged-over': draggedOverPos !== DragOverPosition.NONE,
      before: draggedOverPos === DragOverPosition.BEFORE,
      after: draggedOverPos === DragOverPosition.AFTER,
    }
    return Object.entries(classes).reduce(
      (res, [className, isActive]) => (isActive ? `${res} ${className}` : res),
      ''
    )
  }, [isDragging, isReordering, draggedOverPos])

  return (
    <th
      {...props}
      onClick={onClick}
      draggable={isReordering}
      onDragStart={startReorder}
      onDrag={updatePosition}
      onDragEnd={endReorder}
      onDragLeave={() => setDraggedOverPos(DragOverPosition.NONE)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={classNames}
      // @ts-ignore
      style={currPos ? { '--posX': `${currPos}px` } : undefined}
    >
      <div>
        {isReordering && <ReorderIcon className="reorder-icon" />}
        {children}
      </div>
    </th>
  )
}
