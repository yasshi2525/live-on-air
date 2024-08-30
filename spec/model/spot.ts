import { PlayerBuilder, Field, Player, SpotBuilder, FieldBuilder } from '../../src'

describe('Spot', () => {
  let sb: SpotBuilder
  let field1: Field
  let field2: Field
  let player: Player

  beforeEach(() => {
    sb = new SpotBuilder(scene)
    field1 = new FieldBuilder().build()
    field2 = new FieldBuilder().build()
    player = new PlayerBuilder(scene).build()
    player.standOn(field1)
  })

  it('Spotを配置できる', () => {
    const spot = sb.build()
    expect(spot.field).not.toBeDefined()
    expect(spot.location).not.toBeDefined()
    expect(spot.status).toEqual('non-deployed')
    spot.deployOn(field1)
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
    expect(spot.location).toBeDefined()
    expect(spot.status).toEqual('enabled')
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

  it('訪問不可能にする', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.disable()
    expect(spot.status).toEqual('disabled')
  })

  it('訪問可能にする', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.enable()
    expect(spot.status).toEqual('enabled')
  })

  it('playerを訪問させる', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.setAsDestination()
    expect(spot.status).toEqual('target')
    expect(player.destination).toBe(spot)
  })

  it('playerの訪問をキャンセルさせる', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.setAsDestination()
    spot.unsetAsDestination()
    expect(spot.status).toEqual('enabled')
    expect(player.destination).not.toBeDefined()
  })

  it('fieldに配置されていないと移動対象として設定されない', () => {
    const spot = sb.build()
    expect(() => spot.setAsDestination()).toThrow()
    expect(() => spot.unsetAsDestination()).toThrow()
    expect(() => spot.enable()).toThrow()
    expect(() => spot.disable()).toThrow()
  })

  it('playerがいない場合、移動対象として設定できない', () => {
    const freeField = new FieldBuilder().build()
    const spot = sb.build()
    spot.deployOn(freeField)
    expect(() => spot.setAsDestination()).toThrow()
    expect(() => spot.unsetAsDestination()).toThrow()
  })
})
