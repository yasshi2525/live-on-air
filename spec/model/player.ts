import { Field, FieldImpl } from '../../src/model/field'
import { PlayerImpl } from '../../src/model/player'
import { Spot, SpotBuilder } from '../../src'

describe('Player', () => {
  let field1: Field
  let field2: Field
  let sb: SpotBuilder
  let spot1: Spot
  let spot2: Spot

  beforeEach(() => {
    field1 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field2 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    sb = new SpotBuilder(scene)
    spot1 = sb.build()
    spot2 = sb.build()
    field1.addSpot(spot1)
    field1.addSpot(spot2)
  })

  it('fieldに入場できる', () => {
    const player = new PlayerImpl()
    expect(player.field).not.toBeDefined()
    expect(player.location).not.toBeDefined()
    player.standOn(field1)
    expect(player.field).toBe(field1)
    expect(player.location).toBeDefined()
  })

  it('同じFieldへの二重登録時は警告だけで何もしない', () => {
    const player = new PlayerImpl()
    player.standOn(field1)
    player.standOn(field1)
    expect(player.field).toBe(field1)
    expect(field1.player).toBe(player)
  })

  it('他のFieldには配置できない', () => {
    const player = new PlayerImpl()
    player.standOn(field1)
    expect(() => player.standOn(field2)).toThrow()
    expect(player.field).toBe(field1)
    expect(field1.player).toBe(player)
    expect(field2.player).not.toBeDefined()
  })
})
