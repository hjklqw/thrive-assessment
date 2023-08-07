import { atom } from 'recoil'
import { LocalStorageManager } from './localStorageManager'

export const columnOrderStore = new LocalStorageManager<string[]>(
  'columnOrders'
)

/** An array containing each column's name. */
export const columnOrderAtom = atom<string[] | null>({
  key: 'columnOrders',
  default: columnOrderStore.get(),
})
