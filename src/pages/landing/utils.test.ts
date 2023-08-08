import { toast } from 'react-toastify'

import { daysFromToday, save, reload } from './utils'
import { columnOrderStore } from '../../state/columnOrders'

jest.useFakeTimers()

describe('Landing page - utils', () => {
  describe('daysFromToday()', () => {
    it('should correctly calculate the number of days from today', () => {
      jest.setSystemTime(new Date('2023-07-23'))
      expect(daysFromToday(new Date('2023-07-22'))).toBe(1)
      expect(daysFromToday(new Date('2023-07-13'))).toBe(10)
      expect(daysFromToday(new Date('2022-07-23'))).toBe(365)
    })
  })

  describe('save()', () => {
    it('should show a "no changes" message when there are no saved column orders', () => {
      const spy = jest.spyOn(toast, 'info')
      save(null)
      expect(spy).toHaveBeenCalledWith('There are no changes to save.')
    })

    it('should show a success message when column orders have been changed', () => {
      jest.spyOn(columnOrderStore, 'get').mockReturnValue(null)
      const toastSpy = jest.spyOn(toast, 'success')
      const storageSetSpy = jest
        .spyOn(columnOrderStore, 'set')
        .mockImplementation(() => {})

      const columnOrders = ['col1', 'col2']
      save(columnOrders)

      expect(storageSetSpy).toHaveBeenCalledWith(columnOrders)
      expect(toastSpy).toHaveBeenCalledWith('Saved!')
    })

    it('should show a "no changes" message when the given column orders are the same as what\'s already been stored', () => {
      const columnOrders = ['col1', 'col2', 'col3']

      jest.spyOn(columnOrderStore, 'get').mockReturnValue(columnOrders)
      const toastSpy = jest.spyOn(toast, 'info')
      const storageSetSpy = jest.spyOn(columnOrderStore, 'set')

      save(columnOrders)

      expect(storageSetSpy).not.toHaveBeenCalled()
      expect(toastSpy).toHaveBeenCalledWith('There are no changes to save.')
    })
  })

  describe('reload()', () => {
    const setColumnOrders = jest.fn()

    it('should show a "no changes" message when there are no column orders', () => {
      const spy = jest.spyOn(toast, 'info')
      reload(false, setColumnOrders)
      expect(spy).toHaveBeenCalledWith('No changes have been made.')
    })

    it('should clear orders from the state and storage, then show a success message when there are column orders', () => {
      const toastSpy = jest.spyOn(toast, 'success')
      const storageSetSpy = jest
        .spyOn(columnOrderStore, 'clear')
        .mockImplementation(() => {})

      reload(true, setColumnOrders)

      expect(setColumnOrders).toHaveBeenCalledWith(null)
      expect(storageSetSpy).toHaveBeenCalled()
      expect(toastSpy).toHaveBeenCalledWith('Column orders restored!')
    })
  })
})
