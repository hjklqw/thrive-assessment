import { generateUsers } from '../../data/generator'
import { User } from '../../domain/user'
import { Column } from '../../components/table'

import { daysFromToday } from './utils'

export const users = generateUsers(500)

export const columns: Column<User>[] = [
  { name: 'ID', propertyKey: 'id' },
  {
    name: 'Full Name',
    propertyKey: 'firstName',
    render: (row: User) => `${row.firstName} ${row.lastName}`,
  },
  { name: 'First Name', propertyKey: 'firstName' },
  { name: 'Last Name', propertyKey: 'lastName' },
  { name: 'Email', propertyKey: 'email' },
  { name: 'City', propertyKey: 'city' },
  {
    name: 'Days Since Registered',
    propertyKey: 'registeredDate',
    centerText: true,
    render: (row: User) => daysFromToday(row.registeredDate),
    sort: (data, isAscending) =>
      data.sort((a, b) => {
        const aDays = daysFromToday(a.registeredDate)
        const bDays = daysFromToday(b.registeredDate)
        return isAscending ? aDays - bDays : bDays - aDays
      }),
  },
]
