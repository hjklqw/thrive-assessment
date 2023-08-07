export class LocalStorageManager<T> {
  private readonly storageKey: string

  constructor(key: string) {
    this.storageKey = `thrive-assessment-${key}`
  }

  set(data: T) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  get(): T | null {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : null
  }

  clear() {
    localStorage.removeItem(this.storageKey)
  }
}
