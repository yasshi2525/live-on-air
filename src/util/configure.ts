import { RecordConfigure } from './configureRecord'
import { RecordWithDefaultConfigure } from './configureRecordDefault'

export class Configure<K extends string, V> {
  readonly current: RecordConfigure<K, V>
  readonly _default: RecordWithDefaultConfigure<K, V>

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

  keys (): K[] {
    return [...new Set<K>([
      ...this._default.keys(),
      ...this.current.keys()
    ]).keys()]
  }

  entries (): Record<K, V> {
    return { ...this._default.entries(), ...this.current.entries() }
  }

  get (key: K): V {
    return (this.current.has(key) ? this.current : this._default).get(key)
  }

  put (key: K, value: V): void {
    this.current.put(key, value)
  }

  putAll (entry: Partial<Record<K, V>>) {
    this.current.putAll(entry)
  }

  getDefault (key: K): V {
    return this._default.get(key)
  }

  putDefault (key: K, value: V): void {
    this._default.put(key, value)
  }

  putAllDefault (entry: Partial<Record<K, V>>) {
    this._default.putAll(entry)
  }

  clear () {
    this.current.clear()
  }
}
