import { RecordConfigure } from './configureRecord'

export class RecordWithDefaultConfigure<K extends string, V> extends RecordConfigure<K, V> {
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
