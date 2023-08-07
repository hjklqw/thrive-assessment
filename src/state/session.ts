import { atom } from 'recoil'

/** Describes whether or not the user is currently logged in. */
export const isLoggedInAtom = atom<boolean>({
  key: 'isLoggedIn',
  default: false,
})
