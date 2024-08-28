import { Field, FieldImpl } from '../../src/model/field'
import { SpotBuilder } from '../../src'

describe('Spot', () => {
  let sb: SpotBuilder
  let field1: Field
  let field2: Field

  beforeEach(() => {
    sb = new SpotBuilder(scene)
    field1 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field2 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
  })

  it('Spotを配置できる', () => {
    const spot = sb.build()
    expect(spot.field).not.toBeDefined()
    expect(spot.location).not.toBeDefined()
    spot.deployOn(field1)
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
    expect(spot.location).toBeDefined()
  })

  it('同じFieldへの二重登録時は何もしない', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.deployOn(field1)
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
  })

  it('他のFieldには配置できない', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    expect(() => spot.deployOn(field2)).toThrow()
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
    expect(field2.spots).not.toContain(spot)
  })
})
