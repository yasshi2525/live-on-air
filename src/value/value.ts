/**
 * デフォルト値を持つ値を提供します.
 */
export interface ValueSupplier<T> {
  /**
   * 値を取得します.
   *
   * 値が存在しないときはデフォルト値を返します.
   */
  get (): T

  /**
   * デフォルト値を取得します.
   */
  default (): T

  /**
   * 値が有効な場合、格納します.
   *
   * @param value 格納する値.
   */
  setIf (value: T): void

  /**
   * 値が有効な場合、デフォルト値として格納します.
   *
   * @param value 格納する値.
   */
  defaultIf (value: T): void
}

export abstract class ValueValidator<T> {
  abstract isInvalid (value: T): boolean
  getMessage (value: T): string {
    return `値 "${typeof value === 'object' ? JSON.stringify(value) : value}" は設定できません.`
  }
}

export class DefaultValueProvider<T> {
  private value: T

  constructor (initial: T, private validator?: ValueValidator<T>) {
    this.throwsIf(initial)
    this.value = initial
  }

  get (): T {
    return this.value
  }

  set (value: T): void {
    this.throwsIf(value)
    this.value = value
  }

  private throwsIf (value: T): void {
    if (this.validator?.isInvalid(value)) {
      throw new Error(this.validator.getMessage(value))
    }
  }
}

export class PrimitiveValueSupplier<T> implements ValueSupplier<T> {
  protected _value?: T

  // eslint-disable-next-line no-useless-constructor
  protected constructor (protected defaultValue: DefaultValueProvider<T>, protected validator?: ValueValidator<T>) {}

  get (): T {
    return this._value ?? this.defaultValue.get()
  }

  default (): T {
    return this.defaultValue.get()
  }

  setIf (value?: T): void {
    if (this.isValid(value)) {
      this.throwsIf(value)
      this._value = value
    }
  }

  defaultIf (value?: T): void {
    if (this.isValid(value)) {
      this.throwsIf(value)
      this.defaultValue.set(value)
    }
  }

  protected isValid (value?: T): value is T {
    return value !== undefined && value !== null
  }

  protected throwsIf (value: T): void {
    if (this.validator?.isInvalid(value)) {
      throw new Error(this.validator.getMessage(value))
    }
  }

  static create <V> (initial: V, validator?: ValueValidator<V>): PrimitiveValueSupplier<V> {
    return new PrimitiveValueSupplier(new DefaultValueProvider<V>(initial, validator), validator)
  }
}

export class ObjectSupplier<T> extends PrimitiveValueSupplier<T> implements ValueSupplier<T> {
  override setIf (obj?: Partial<T>): void {
    if (this.isValid(obj)) {
      if (this.validator?.isInvalid(obj)) {
        throw new Error(this.validator.getMessage(obj))
      }
      this._value = this.parseForcibly(obj)
    }
  }

  override defaultIf (obj?: Partial<T>): void {
    if (this.isValid(obj)) {
      if (this.validator?.isInvalid(obj)) {
        throw new Error(this.validator.getMessage(obj))
      }
      this.defaultValue.set(this.parseForcibly(obj))
    }
  }

  protected override isValid (obj?: Partial<T>): obj is T {
    return super.isValid(obj as T) && !Object.keys(this.defaultValue.get() as object).some(key => !Object.prototype.hasOwnProperty.call(obj, key))
  }

  private parseForcibly (obj?: Partial<T>): T {
    return Object.keys(this.defaultValue.get() as object).reduce((_obj, current) => {
      _obj[current] = (obj as Record<string, unknown>)[current]
      return _obj
    }, {} as Record<string, unknown>) as T
  }

  static create <V> (initial: V, validator?: ValueValidator<V>): ObjectSupplier<V> {
    return new ObjectSupplier<V>(new DefaultValueProvider<V>(initial, validator), validator)
  }
}

export class RecordSupplier<K extends string, V> implements ValueSupplier<Record<K, V>> {
  private readonly store = new Map<K, PrimitiveValueSupplier<V>>()

  protected constructor (initial: Record<K, V>, private validator?: ValueValidator<V>) {
    for (const [key, value] of Object.entries(initial) as [K, V][]) {
      this.store.set(key, PrimitiveValueSupplier.create(value, validator))
    }
  }

  get (): Record<K, V> {
    return [...this.store.entries()].reduce((obj, [key, supplier]) => {
      obj[key] = supplier.get()
      return obj
    }, {} as Record<K, V>)
  }

  default (): Record<K, V> {
    return [...this.store.entries()].reduce((obj, [key, supplier]) => {
      obj[key] = supplier.default()
      return obj
    }, {} as Record<K, V>)
  }

  setIf (obj: Partial<Record<K, V>>) {
    for (const [key, value] of Object.entries(obj) as [K, V][]) {
      this.store.get(key)?.setIf(value)
    }
  }

  defaultIf (obj: Partial<Record<K, V>>) {
    for (const [key, value] of Object.entries(obj) as [K, V][]) {
      this.store.get(key)?.defaultIf(value)
    }
  }

  static create <K extends string, V> (initial: Record<K, V>, validator?: ValueValidator<V>): RecordSupplier<K, V> {
    return new RecordSupplier<K, V>(initial, validator)
  }
}

export class ArraySupplier<T> implements ValueSupplier<T[]> {
  private defaultStore: T[] = []
  private store: T[] = []

  // eslint-disable-next-line no-useless-constructor
  protected constructor (protected defaultValue: T[], protected validator?: ValueValidator<T[]>) {
    this.throwsIf(defaultValue)
    this.defaultStore = [...defaultValue]
  }

  addDefault (value: T): void {
    this.throwsIf([...this.defaultStore, value])
    this.defaultStore.push(value)
  }

  default (): T[] {
    return [...this.defaultStore]
  }

  defaultIf (value?: T[]): void {
    if (this.isValid(value)) {
      this.throwsIf(value)
      this.defaultStore = [...value]
    }
  }

  add (value: T): void {
    this.throwsIf([...this.store, value])
    this.store.push(value)
  }

  get (): T[] {
    return [...this.defaultStore, ...this.store]
  }

  setIf (value?: T[]): void {
    if (this.isValid(value)) {
      this.throwsIf(value)
      this.store = [...value]
    }
  }

  protected isValid (value?: T[]): value is T[] {
    return value !== undefined && value !== null
  }

  protected throwsIf (value: T[]): void {
    if (this.validator?.isInvalid(value)) {
      throw new Error(this.validator.getMessage(value))
    }
  }

  static create <V> (initial: V[], validator?: ValueValidator<V[]>): ArraySupplier<V> {
    return new ArraySupplier(initial, validator)
  }
}
