export class RecordConfigure<K extends string, V> {
  protected readonly entry: Partial<Record<K, V>>

  constructor (entry: Partial<Record<K, V>>) {
    this.entry = { ...entry }
  }

  keys (mandatory?: readonly K[]): K[] {
    return [...new Set([...Object.keys(this.entry) as K[], ...mandatory ?? []]).keys()]
  }

  entries (mandatory?: readonly K[]): Record<K, V> {
    return this.keys(mandatory).reduce((prev, current) => {
      prev[current] = this.get(current)
      return prev
    }, {} as Record<K, V>)
  }

  has (key: K): boolean {
    return key in this.entry
  }

  get (key: K): V {
    if (!this.entry[key]) {
      throw new Error(`Unknown key "${key}" in group config`)
    }
    return this.entry[key]
  }

  put (key: K, value: V): void {
    if (!value) {
      throw new Error(`Value of key "${key}" must be set`)
    }
    this.entry[key] = value
  }

  putAll (entry: Partial<Record<K, V>>) {
    for (const key of Object.keys(entry) as K[]) {
      if (entry[key]) {
        this.put(key, entry[key])
      }
    }
  }

  clear (): void {
    const keys = Object.keys(this.entry) as K[]
    for (const key of keys) {
      delete this.entry[key]
    }
  }
}
