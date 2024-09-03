import { ValueSupplier } from './value'

export class FieldConfigSupplier implements ValueSupplier<object> {
  private value?: object

  // eslint-disable-next-line no-useless-constructor
  constructor (private _default: object) {}

  get (): object {
    return this.value ? { ...this.value } : { ...this._default }
  }

  setIf (obj: object) {
    this.value = obj
  }

  default (): object {
    return { ...this._default }
  }

  defaultIf (obj: object) {
    this._default = { ...obj }
  }
}
