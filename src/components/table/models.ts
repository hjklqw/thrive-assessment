export interface Column<T> {
  /** The column's header. */
  name: string
  /** The property that this column renders. The `sort` and `render` functions will use this by default. */
  propertyKey: keyof T
  /** Whether or not text should be centered in the data rows of this column. */
  centerText?: boolean
  /** An optional rendering function to use for this column. Uses the `propertyKey` by default. */
  render?: (row: T) => React.ReactNode
  /** An optional sorting function to use for this column. Uses string sort by default. */
  sort?: (data: T[], isAscending: boolean) => T[]
}
