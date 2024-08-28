import { Field, FieldImpl } from '../../src/model/field'
import { PlayerImpl } from '../../src/model/player'

describe('Player', () => {
  let field1: Field
  let field2: Field

  beforeEach(() => {
    field1 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field2 = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
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
    expect(field1.players).toContain(player)
  })

  it('他のFieldには配置できない', () => {
    const player = new PlayerImpl()
    player.standOn(field1)
    expect(() => player.standOn(field2)).toThrow()
    expect(player.field).toBe(field1)
    expect(field1.players).toContain(player)
    expect(field2.players).not.toContain(player)
  })
})
