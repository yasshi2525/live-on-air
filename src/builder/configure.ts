class RecordConfigure<K extends string, V> {
  protected readonly entry: Partial<Record<K, V>>

  constructor (entry: Partial<Record<K, V>>) {
    this.entry = { ...entry }
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

  clear (): void {
    const keys = Object.keys(this.entry) as K[]
    for (const key of keys) {
      delete this.entry[key]
    }
  }
}

class RecordWithDefaultConfigure<K extends string, V> extends RecordConfigure<K, V> {
  constructor (private _default: V, entry: Partial<Record<K, V>>) {
    if (!_default) {
      throw new Error('default value must be set')
    }
    super(entry)
  }

  get default (): V {
    return this._default
  }

  set default (value: V) {
    if (!value) {
      throw new Error('default value must be set')
    }
    this._default = value
  }

  override has (key: K): boolean {
    console.warn(`default config always has value of key ${key}`)
    return true
  }

  override get (key: K): V {
    if (!super.has(key)) {
      return this._default
    }
    return super.get(key)
  }
}

export class Configure<K extends string, V> {
  private readonly current: RecordConfigure<K, V>
  private readonly _default: RecordWithDefaultConfigure<K, V>

  constructor (_default: V, defaultEntry: Partial<Record<K, V>> = {}, entry: Partial<Record<K, V>> = {}) {
    this._default = new RecordWithDefaultConfigure<K, V>(_default, defaultEntry)
    this.current = new RecordConfigure<K, V>(entry)
  }

  get default (): V {
    return this._default.default
  }

  set default (value: V) {
    this._default.default = value
  }

  get (key: K): V {
    return (this.current.has(key) ? this.current : this._default).get(key)
  }

  put (key: K, value: V): void {
    this.current.put(key, value)
  }

  getDefault (key: K): V {
    return this._default.get(key)
  }

  putDefault (key: K, value: V): void {
    this._default.put(key, value)
  }

  clear () {
    this.current.clear()
  }
}
