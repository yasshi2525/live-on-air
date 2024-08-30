import { Field, FieldImpl } from '../../src/model/field'
import { PlayerBuilder, Spot, SpotBuilder } from '../../src'

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
    const player = new PlayerBuilder(scene).build()
    expect(player.field).not.toBeDefined()
    expect(player.location).not.toBeDefined()
    expect(player.status).toEqual('non-field')
    player.standOn(field1)
    expect(player.field).toBe(field1)
    expect(player.location).toBeDefined()
    expect(player.status).toEqual('stopping')
  })

  it('同じFieldへの二重登録時は警告だけで何もしない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.standOn(field1)
    expect(player.field).toBe(field1)
    expect(field1.player).toBe(player)
  })

  it('他のFieldには配置できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    expect(() => player.standOn(field2)).toThrow()
    expect(player.field).toBe(field1)
    expect(field1.player).toBe(player)
    expect(field2.player).not.toBeDefined()
  })

  it('指定した目的地(spot1)に移動できる', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    expect(player.destination).toBe(spot1)
    expect(player.status).toEqual('moving')
    expect(spot1.status).toEqual('target')
    expect(spot2.status).toEqual('disabled')
  })

  it('移動中の場合、移動をキャンセルできる', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    player.stop()
    expect(player.destination).not.toBeDefined()
    expect(player.status).toEqual('stopping')
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('enabled')
  })

  it('fieldに配置されていないと移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    expect(() => player.jumpTo(spot1)).toThrow()
    expect(() => player.departTo(spot1)).toThrow()
    expect(() => player.stop()).toThrow()
  })

  it('指定した位置に即時移動できる', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.jumpTo(spot1)
    expect(player.staying).toBe(spot1)
    expect(player.location).toEqual(spot1.location)
    expect(player.status).toEqual('staying')
  })

  it('fieldに配置されていないspotには移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    const freeSpot = sb.build()
    expect(() => player.jumpTo(freeSpot)).toThrow()
    expect(() => player.departTo(freeSpot)).toThrow()
  })

  it('異なるfieldのspotには移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    const otherSpot = sb.build()
    otherSpot.deployOn(field2)
    expect(() => player.jumpTo(otherSpot)).toThrow()
    expect(() => player.departTo(otherSpot)).toThrow()
  })

  it('移動中は移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    expect(() => player.departTo(spot2)).toThrow()
    expect(() => player.jumpTo(spot2)).toThrow()
    expect(player.destination).toBe(spot1)
    expect(player.staying).not.toBeDefined()
  })

  it('停止中は移動停止できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    expect(() => player.stop()).toThrow()
    expect(player.status).toBe('stopping')
  })

  it('移動速度を設定できる', () => {
    const player = new PlayerBuilder(scene).build()
    expect(player.speed).toBe(1)
    player.speed = 2
    expect(player.speed).toBe(2)
  })

  it('負の速度は設定できない', () => {
    const player = new PlayerBuilder(scene).build()
    expect(() => {
      player.speed = 0
    }).toThrow()
    expect(() => {
      player.speed = -1
    }).toThrow()
    expect(player.speed).toBe(1)
  })
})
