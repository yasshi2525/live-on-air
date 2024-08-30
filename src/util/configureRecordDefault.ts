import { RecordConfigure } from './configureRecord'

export class RecordWithDefaultConfigure<K extends string, V> extends RecordConfigure<K, V> {
  constructor (private _default: V, entry: Partial<Record<K, V>>) {
    if (!_default) {
      throw new Error(`存在しない値 "${_default}" をデフォルト値に設定しようとしました. デフォルト値は存在する必要があります`)
    }
    super(entry)
  }

  get default (): V {
    return this._default
  }

  set default (value: V) {
    if (!value) {
      throw new Error(`存在しない値 "${value}" をデフォルト値に設定しようとしました. デフォルト値は存在する必要があります`)
    }
    this._default = value
  }

  // 本クラスをメンバとして持つ Configure は利用しないため非到達
  // istanbul ignore next
  override has (): boolean {
    return true
  }

  override get (key: K): V {
    if (!super.has(key)) {
      return this._default
    }
    return super.get(key)
  }
}
