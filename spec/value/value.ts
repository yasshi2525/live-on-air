import { RecordSupplier, ObjectSupplier, PrimitiveValueSupplier, ValueValidator } from '../../src/value/value'

describe('supplier', () => {
  describe('primitive value', () => {
    describe('no validator', () => {
      let supplier: PrimitiveValueSupplier<number>
      beforeEach(() => {
        supplier = PrimitiveValueSupplier.create(1)
      })
      it('デフォルト値を設定できる', () => {
        supplier.defaultIf(2)
        expect(supplier.default()).toBe(2)
        expect(supplier.get()).toBe(2)
      })
      it('存在しない値の場合、デフォルト値は更新されない', () => {
        supplier.defaultIf(undefined)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(1)
      })
      it('値を設定できる', () => {
        supplier.setIf(2)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(2)
      })
      it('存在しない値の場合、値は更新されない', () => {
        supplier.setIf(undefined)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(1)
      })
    })
    describe('with validator', () => {
      let supplier: PrimitiveValueSupplier<number>
      beforeEach(() => {
        supplier = PrimitiveValueSupplier.create(1, new class extends ValueValidator<number> {
          isInvalid (value: number): boolean {
            return value <= 0
          }
        }())
      })
      it('無効な値で初期化はできない', () => {
        expect(() => PrimitiveValueSupplier.create(-1, new class extends ValueValidator<number> {
          isInvalid (value: number): boolean {
            return value <= 0
          }
        }())).toThrow('値 "-1" は設定できません.')
      })
      it('無効な値をデフォルト値にできない', () => {
        supplier.defaultIf(2)
        expect(supplier.default()).toBe(2)
        expect(supplier.get()).toBe(2)
        expect(() => supplier.defaultIf(-1)).toThrow('値 "-1" は設定できません.')
        expect(supplier.default()).toBe(2)
        expect(supplier.get()).toBe(2)
      })
      it('無効な値を設定できない', () => {
        supplier.setIf(2)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(2)
        expect(() => supplier.setIf(-1)).toThrow('値 "-1" は設定できません.')
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(2)
      })
      it('存在しない値の場合、デフォルト値は更新されない', () => {
        supplier.defaultIf(undefined)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(1)
      })
      it('存在しない値の場合、値は更新されない', () => {
        supplier.setIf(undefined)
        expect(supplier.default()).toBe(1)
        expect(supplier.get()).toBe(1)
      })
    })
  })
  describe('object', () => {
    describe('no validator', () => {
      let supplier: ObjectSupplier<g.CommonOffset>
      beforeEach(() => {
        supplier = ObjectSupplier.create({ x: 0, y: 0 })
      })
      it('デフォルト値を設定できる', () => {
        supplier.defaultIf({ x: 2, y: 2 })
        expect(supplier.default()).toEqual({ x: 2, y: 2 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
      })
      it('存在しない値の場合、デフォルト値は更新されない', () => {
        supplier.defaultIf(undefined)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタがまったく足りない場合、デフォルト値は更新されない', () => {
        supplier.defaultIf({})
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタが一部足りない場合、デフォルト値は更新されない', () => {
        supplier.defaultIf({ x: 2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('異なるパラメタはデフォルト値に取り込まない', () => {
        supplier.defaultIf({ x: 2, y: 3, z: 4 } as g.CommonOffset)
        expect(supplier.default()).toEqual({ x: 2, y: 3 })
        expect(supplier.get()).toEqual({ x: 2, y: 3 })
      })
      it('値を設定できる', () => {
        supplier.setIf({ x: 2, y: 2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
      })
      it('存在しない値の場合、値は更新されない', () => {
        supplier.setIf(undefined)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタがまったく足りない場合、値は更新されない', () => {
        supplier.setIf({})
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタが一部足りない場合、値は更新されない', () => {
        supplier.setIf({ x: 2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('異なるパラメタは値に取り込まない', () => {
        supplier.setIf({ x: 2, y: 3, z: 4 } as g.CommonOffset)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 2, y: 3 })
      })
    })
    describe('with validator', () => {
      let supplier: ObjectSupplier<g.CommonOffset>
      beforeEach(() => {
        supplier = ObjectSupplier.create({ x: 0, y: 0 }, new class extends ValueValidator<g.CommonOffset> {
          isInvalid (obj: g.CommonOffset): boolean {
            return obj.x < 0 || obj.y < 0
          }
        }())
      })
      it('無効な値で初期化はできない', () => {
        expect(() => ObjectSupplier.create({ x: -1, y: 2 }, new class extends ValueValidator<g.CommonOffset> {
          isInvalid (obj: g.CommonOffset): boolean {
            return obj.x <= 0 || obj.y <= 0
          }
        }())).toThrow(`値 "${JSON.stringify({ x: -1, y: 2 })}" は設定できません.`)
      })
      it('無効な値をデフォルト値にできない', () => {
        supplier.defaultIf({ x: 2, y: 2 })
        expect(supplier.default()).toEqual({ x: 2, y: 2 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
        expect(() => supplier.defaultIf({ x: 2, y: -1 })).toThrow(`値 "${JSON.stringify({ x: 2, y: -1 })}" は設定できません.`)
        expect(supplier.default()).toEqual({ x: 2, y: 2 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
      })
      it('無効な値を設定できない', () => {
        supplier.setIf({ x: 2, y: 2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
        expect(() => supplier.setIf({ x: 2, y: -1 })).toThrow(`値 "${JSON.stringify({ x: 2, y: -1 })}" は設定できません.`)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 2, y: 2 })
      })
      it('存在しない値の場合、デフォルト値は更新されない', () => {
        supplier.defaultIf(undefined)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタがまったく足りない場合、デフォルト値は更新されない', () => {
        supplier.defaultIf({})
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタが一部足りない場合、デフォルト値は更新されない', () => {
        supplier.defaultIf({ x: -2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('異なるパラメタはデフォルト値に取り込まない', () => {
        supplier.defaultIf({ x: 2, y: 3, z: 4 } as g.CommonOffset)
        expect(supplier.default()).toEqual({ x: 2, y: 3 })
        expect(supplier.get()).toEqual({ x: 2, y: 3 })
      })
      it('存在しない値の場合、値は更新されない', () => {
        supplier.setIf(undefined)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタがまったく足りない場合、値は更新されない', () => {
        supplier.setIf({})
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('パラメタが一部足りない場合、値は更新されない', () => {
        supplier.setIf({ x: -2 })
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 0, y: 0 })
      })
      it('異なるパラメタは値に取り込まない', () => {
        supplier.setIf({ x: 2, y: 3, z: 4 } as g.CommonOffset)
        expect(supplier.default()).toEqual({ x: 0, y: 0 })
        expect(supplier.get()).toEqual({ x: 2, y: 3 })
      })
    })
  })

  describe('record', () => {
    describe('no validator', () => {
      let supplier: RecordSupplier<string, number>
      beforeEach(() => {
        supplier = RecordSupplier.create({ foo: 2, bar: 3 })
      })
      it('デフォルト値を設定できる', () => {
        supplier.defaultIf({ foo: 4, bar: 5 })
        expect(supplier.default()).toEqual({ foo: 4, bar: 5 })
        expect(supplier.get()).toEqual({ foo: 4, bar: 5 })
      })
      it('一部のパラメタが合致した場合、当該パラメタのデフォルト値が更新される', () => {
        supplier.defaultIf({ foo: 100 })
        expect(supplier.default()).toEqual({ foo: 100, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 3 })
      })
      it('異なるパラメタはデフォルト値に取り込まない', () => {
        supplier.defaultIf({ foo: 100, bar: 500, hoge: 1000 })
        expect(supplier.default()).toEqual({ foo: 100, bar: 500 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 500 })
      })
      it('値を設定できる', () => {
        supplier.setIf({ foo: 4, bar: 5 })
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 4, bar: 5 })
      })
      it('一部のパラメタが合致した場合、当該パラメタの値が更新される', () => {
        supplier.setIf({ foo: 100 })
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 3 })
      })
      it('異なるパラメタは値に取り込まない', () => {
        supplier.setIf({ foo: 100, bar: 500, hoge: 1000 })
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 500 })
      })
    })

    describe('with validator', () => {
      let supplier: RecordSupplier<string, number>
      beforeEach(() => {
        supplier = RecordSupplier.create({ foo: 2, bar: 3 }, new class extends ValueValidator<number> {
          isInvalid (value: number): boolean {
            return value < 0
          }
        }())
      })
      it('無効な値で初期化はできない', () => {
        expect(() => RecordSupplier.create({ foo: -2, bar: 3 }, new class extends ValueValidator<number> {
          isInvalid (value: number): boolean {
            return value < 0
          }
        }())).toThrow('値 "-2" は設定できません.')
      })
      it('パラメタの一部が無効な値の場合、当該パラメタのデフォルト値を更新できない', () => {
        supplier.defaultIf({ foo: 4, bar: 5 })
        expect(supplier.default()).toEqual({ foo: 4, bar: 5 })
        expect(supplier.get()).toEqual({ foo: 4, bar: 5 })
        expect(() => supplier.defaultIf({ foo: 8, bar: -5 })).toThrow('値 "-5" は設定できません.')
        expect(supplier.default()).toEqual({ foo: 8, bar: 5 })
        expect(supplier.get()).toEqual({ foo: 8, bar: 5 })
      })
      it('異なるパラメタはデフォルト値に取り込まない', () => {
        supplier.defaultIf({ foo: 100, bar: 500, hoge: 1000 })
        expect(supplier.default()).toEqual({ foo: 100, bar: 500 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 500 })
      })
      it('パラメタの一部が無効な値の場合、当該パラメタの値を更新できない', () => {
        supplier.setIf({ foo: 4, bar: 5 })
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 4, bar: 5 })
        expect(() => supplier.setIf({ foo: -4, bar: 10 })).toThrow('値 "-4" は設定できません.')
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 4, bar: 5 })
      })
      it('異なるパラメタは値に取り込まない', () => {
        supplier.setIf({ foo: 100, bar: 500, hoge: 1000 })
        expect(supplier.default()).toEqual({ foo: 2, bar: 3 })
        expect(supplier.get()).toEqual({ foo: 100, bar: 500 })
      })
    })
  })
})
