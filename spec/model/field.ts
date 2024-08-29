import { Field, FieldImpl } from '../../src/model/field'
import { SpotBuilder, Spot } from '../../src'
import { Player, PlayerImpl } from '../../src/model/player'

describe('field', () => {
  let spot1: Spot
  let spot2: Spot
  let player: Player

  beforeEach(() => {
    spot1 = new SpotBuilder(scene).build()
    spot2 = new SpotBuilder(scene).build()
    player = new PlayerImpl(1)
  })

  it('サイズを設定できる', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    expect(field.area).toEqual({ x: 10, y: 10, width: 500, height: 300 })
  })

  it('スポットが自身に登録できる', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('同じSpotが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addSpot(spot1)
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('異なるFieldに属するspotの登録は受け付けない', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    const otherField: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    otherField.addSpot(spot1)
    expect(() => field.addSpot(spot1)).toThrow()
    expect(otherField.spots).toContain(spot1)
    expect(spot1.field).toBe(otherField)
  })

  it('プレイヤーが自身に登録できる', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addPlayer(player)
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
  })

  it('同じPlayerが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addPlayer(player)
    field.addPlayer(player)
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
  })

  it('Playerは二人以上(player2)登録できない', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    const otherPlayer = new PlayerImpl(1)
    field.addPlayer(player)
    expect(() => field.addPlayer(otherPlayer)).toThrow()
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
    expect(otherPlayer.field).not.toBeDefined()
  })

  it('異なるFieldに属するplayerの登録は受け付けない', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    const otherField: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    otherField.addPlayer(player)
    expect(() => field.addPlayer(player)).toThrow()
    expect(otherField.player).toBe(player)
    expect(player.field).toBe(otherField)
  })

  it('特定のSpot(spot1)以外のSpot(spot2)を目的地として設定できないようになる', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addSpot(spot1)
    field.addSpot(spot2)
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('enabled')
    field.disableSpotExcept(spot1)
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('disabled')
  })

  it('特定のSpot(spot1)以外のSpot(spot2)が訪問可能になる', () => {
    const field: Field = new FieldImpl({ x: 10, y: 10, width: 500, height: 300 })
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addPlayer(player)
    player.departTo(spot1)
    expect(spot1.status).toEqual('target')
    expect(spot2.status).toEqual('disabled')
    field.enableSpotExcept(spot1)
    expect(spot1.status).toEqual('target')
    expect(spot2.status).toEqual('enabled')
  })
})
