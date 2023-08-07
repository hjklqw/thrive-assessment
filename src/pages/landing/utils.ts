import { toast } from 'react-toastify'
import { SetterOrUpdater } from 'recoil'

import { columnOrderStore } from '../../state/columnOrders'

const ONE_DAY = 24 * 60 * 60 * 1000

export function daysFromToday(date: Date) {
  return Math.round(Math.abs((date.getTime() - Date.now()) / ONE_DAY))
}

export function save(columnOrders: string[] | null) {
  const storedOrders = columnOrderStore.get()
  const wasChangedFromStorage =
    columnOrders && storedOrders
      ? columnOrders.some((name, i) => storedOrders[i] !== name)
      : true
  if (columnOrders && wasChangedFromStorage) {
    columnOrderStore.set(columnOrders)
    toast.success('Saved!')
  } else {
    toast.info('There are no changes to save.')
  }
}

export function reload(
  hasColumnOrders: boolean,
  setColumnOrders: SetterOrUpdater<string[] | null>
) {
  if (hasColumnOrders) {
    columnOrderStore.clear()
    setColumnOrders(null)
    toast.success('Column orders restored!')
  } else {
    toast.info('No changes have been made.')
  }
}
