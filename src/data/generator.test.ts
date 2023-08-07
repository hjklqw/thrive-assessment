import { generateUsers } from './generator'

describe('generateUsers', () => {
  it('generates the specified amount of users', () => {
    const numUsers = 5
    expect(generateUsers(numUsers).length).toBe(numUsers)
  })

  it('generates users with unique emails', () => {
    const emails = generateUsers(500).map((u) => u.email)
    expect(new Set(emails).size).toEqual(emails.length)
  })
})
