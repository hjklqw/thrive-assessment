import { faker } from '@faker-js/faker'
import { UniqueEnforcer } from 'enforce-unique'

import { User } from '../domain/user'

const uniqueEnforcerEmail = new UniqueEnforcer()

function generateUser(): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = uniqueEnforcerEmail.enforce(() => {
    return faker.internet.email({ firstName, lastName })
  })

  return {
    id: faker.string.uuid(),
    email,
    firstName,
    lastName,
    city: faker.location.city(),
    registeredDate: faker.date.past(),
  }
}

export function generateUsers(numUsers: number) {
  return Array.from({ length: numUsers }).map(() => generateUser())
}
