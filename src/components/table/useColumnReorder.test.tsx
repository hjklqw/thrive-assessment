import { renderHook, act, render, screen } from '@testing-library/react'

import { useColumnReorder } from './useColumnReorder'
import { Column } from './models'
import { RecoilRoot } from 'recoil'

type Data = {
  col1: string
  col2: string
  col3: string
}

const columns: Column<Data>[] = [
  {
    name: 'Column 1',
    propertyKey: 'col1',
  },
  {
    name: 'Column 2',
    propertyKey: 'col2',
  },
  {
    name: 'Column 3',
    propertyKey: 'col3',
  },
]

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
)

function getHookResult() {
  const { result } = renderHook(() => useColumnReorder(columns), {
    wrapper,
  })
  return result
}

describe('Table component - useColumnReorder', () => {
  describe('isEnabled and button', () => {
    it('isEnabled should start off false', () => {
      const hook = getHookResult()
      expect(hook.current.isEnabled).toBeFalsy()
    })

    it('isEnabled be toggled when clicking on the button', () => {
      const hook = getHookResult()
      render(hook.current.button)
      const button = screen.getByTestId('reorder-toggle-button')
      act(() => button.click())
      expect(hook.current.isEnabled).toBeTruthy()
      act(() => button.click())
      expect(hook.current.isEnabled).toBeFalsy()
    })
  })

  describe('reorder()', () => {
    it('should properly reorder from a lower index to a higher one', () => {
      const hook = getHookResult()
      act(() => hook.current.reorder(0, 2))
      expect(hook.current.orderedColumns).toEqual([
        {
          name: 'Column 2',
          propertyKey: 'col2',
        },
        {
          name: 'Column 3',
          propertyKey: 'col3',
        },
        {
          name: 'Column 1',
          propertyKey: 'col1',
        },
      ])
    })

    it('should properly reorder from a higher index to a lower one', () => {
      const hook = getHookResult()
      act(() => hook.current.reorder(1, 0))
      expect(hook.current.orderedColumns).toEqual([
        {
          name: 'Column 2',
          propertyKey: 'col2',
        },
        {
          name: 'Column 1',
          propertyKey: 'col1',
        },
        {
          name: 'Column 3',
          propertyKey: 'col3',
        },
      ])
    })
  })
})
