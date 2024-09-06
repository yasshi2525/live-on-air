import { SpotBuilder, Spot, PlayerBuilder, Player, Field, FieldBuilder, ScreenBuilder } from '../../src'
import { FieldImpl } from '../../src/model/field'

describe('field', () => {
  let spot1: Spot
  let spot2: Spot
  let player: Player
  let layer1: g.E
  let layer2: g.E

  beforeEach(() => {
    spot1 = new SpotBuilder(scene).build()
    spot2 = new SpotBuilder(scene).build()
    player = new PlayerBuilder(scene).build()
    layer1 = new g.E({ scene, parent: scene, x: 10, y: 10, width: 500, height: 300 })
    layer2 = new g.E({ scene, parent: scene, x: 520, y: 20, width: 600, height: 600 })
    layer1.append(new g.FilledRect({ scene, width: layer1.width, height: layer1.height, cssColor: '#ffaaaa', opacity: 0.25 }))
    layer2.append(new g.FilledRect({ scene, width: layer2.width, height: layer2.height, cssColor: '#aaffaa', opacity: 0.25 }))
    const screen = new ScreenBuilder(scene).build()
    spot1.attach(screen)
    spot2.attach(screen)
  })

  it('スポットが自身に登録できる', () => {
    const field: Field = new FieldBuilder().build()
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('同じSpotが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldBuilder().build()
    field.addSpot(spot1)
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('異なるFieldに属するspotの登録は受け付けない', () => {
    const field: Field = new FieldBuilder().build()
    const otherField: Field = new FieldBuilder().build()
    otherField.addSpot(spot1)
    expect(() => field.addSpot(spot1)).toThrow()
    expect(otherField.spots).toContain(spot1)
    expect(spot1.field).toBe(otherField)
  })

  it('プレイヤーが自身に登録できる', () => {
    const field: Field = new FieldBuilder().build()
    field.addPlayer(player)
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
  })

  it('同じPlayerが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldBuilder().build()
    field.addPlayer(player)
    field.addPlayer(player)
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
  })

  it('Playerは二人以上(player2)登録できない', () => {
    const field: Field = new FieldBuilder().build()
    const otherPlayer = new PlayerBuilder(scene).build()
    field.addPlayer(player)
    expect(() => field.addPlayer(otherPlayer)).toThrow()
    expect(field.player).toBe(player)
    expect(player.field).toBe(field)
    expect(otherPlayer.field).not.toBeDefined()
  })

  it('異なるFieldに属するplayerの登録は受け付けない', () => {
    const field: Field = new FieldBuilder().build()
    const otherField: Field = new FieldBuilder().build()
    otherField.addPlayer(player)
    expect(() => field.addPlayer(player)).toThrow()
    expect(otherField.player).toBe(player)
    expect(player.field).toBe(otherField)
  })

  it('特定のSpot(spot1)以外のSpot(spot2)を目的地として設定できないようになる', () => {
    const field: Field = new FieldBuilder().build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('enabled')
    field.disableSpotExcept(spot1)
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('disabled')
  })

  it('特定のSpot(spot1)以外のSpot(spot2)が訪問可能になる', () => {
    const field: Field = new FieldBuilder().build()
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

  it('g.Eを登録すると今まで登録されたspot,playerが画面に描画される', async () => {
    const field: Field = new FieldImpl()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addPlayer(player)
    expect(field.view).not.toBeDefined()
    expect(field.area).not.toBeDefined()
    await gameContext.step()
    screenshot('field.view.initial.png')
    field.view = layer1
    expect(spot1.view.parent).toBe(layer1)
    expect(spot2.view.parent).toBe(layer1)
    expect(player.view.parent).toBe(layer1)
    expect(field.area).toEqual({ x: 10, y: 10, width: 500, height: 300 })
    await gameContext.step()
    screenshot('field.view.follow.png')
  })

  it('先にg.Eを登録してからspot,playerを登録しても描画される', async () => {
    const field: Field = new FieldImpl()
    field.view = layer1
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addPlayer(player)
    expect(spot1.view.parent).toBe(layer1)
    expect(spot2.view.parent).toBe(layer1)
    expect(player.view.parent).toBe(layer1)
    expect(field.area).toEqual({ x: 10, y: 10, width: 500, height: 300 })
    await gameContext.step()
    screenshot('field.view.register.png')
  })

  it('viewを差し替えるとspot,playerは差し替え後の方に所属する', async () => {
    const field: Field = new FieldImpl()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addPlayer(player)
    field.view = layer1
    field.view = layer2
    expect(spot1.view.parent).toBe(layer2)
    expect(spot2.view.parent).toBe(layer2)
    expect(player.view.parent).toBe(layer2)
    expect(field.area).toEqual({ x: 520, y: 20, width: 600, height: 600 })
    await gameContext.step()
    screenshot('field.view.change.png')
  })

  it('viewが削除されるとspot,playerも孤立する', async () => {
    const field: Field = new FieldImpl()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addPlayer(player)
    field.view = layer1
    field.view = undefined
    expect(spot1.view.parent).not.toBeDefined()
    expect(spot2.view.parent).not.toBeDefined()
    expect(player.view.parent).not.toBeDefined()
    expect(field.area).not.toBeDefined()
    await gameContext.step()
    screenshot('field.view.remove.png')
  })
})
