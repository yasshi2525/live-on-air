import { SpotBuilder, Spot, BroadcasterBuilder, Broadcaster, Field, FieldBuilder, ScreenBuilder } from '../../src'

describe('field', () => {
  let spot1: Spot
  let spot2: Spot
  let broadcaster: Broadcaster
  let layer1: g.E
  let layer2: g.E

  beforeEach(() => {
    spot1 = new SpotBuilder(scene).build()
    spot2 = new SpotBuilder(scene).build()
    broadcaster = new BroadcasterBuilder(scene).build()
    layer1 = new g.E({ scene, parent: scene, x: 10, y: 10, width: 500, height: 300 })
    layer2 = new g.E({ scene, parent: scene, x: 520, y: 20, width: 600, height: 600 })
    layer1.append(new g.FilledRect({ scene, width: layer1.width, height: layer1.height, cssColor: '#ffaaaa', opacity: 0.25 }))
    layer2.append(new g.FilledRect({ scene, width: layer2.width, height: layer2.height, cssColor: '#aaffaa', opacity: 0.25 }))
    const screen = new ScreenBuilder(scene).build()
    spot1.attach(screen)
    spot2.attach(screen)
  })

  it('スポットが自身に登録できる', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('同じSpotが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot1)
    expect(field.spots).toContain(spot1)
    expect(spot1.field).toBe(field)
  })

  it('異なるFieldに属するspotの登録は受け付けない', () => {
    const field: Field = new FieldBuilder(scene).build()
    const otherField: Field = new FieldBuilder(scene).build()
    otherField.addSpot(spot1)
    expect(() => field.addSpot(spot1)).toThrow()
    expect(otherField.spots).toContain(spot1)
    expect(spot1.field).toBe(otherField)
  })

  it('放送者（プレイヤー）が自身に登録できる', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addBroadcaster(broadcaster)
    expect(field.broadcaster).toBe(broadcaster)
    expect(broadcaster.field).toBe(field)
  })

  it('同じBroadcasterが二回登録を試みても警告だけで何もしない', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addBroadcaster(broadcaster)
    field.addBroadcaster(broadcaster)
    expect(field.broadcaster).toBe(broadcaster)
    expect(broadcaster.field).toBe(field)
  })

  it('Broadcasterは二人以上(otherBroadcaster)登録できない', () => {
    const field: Field = new FieldBuilder(scene).build()
    const otherBroadcaster = new BroadcasterBuilder(scene).build()
    field.addBroadcaster(broadcaster)
    expect(() => field.addBroadcaster(otherBroadcaster)).toThrow()
    expect(field.broadcaster).toBe(broadcaster)
    expect(broadcaster.field).toBe(field)
    expect(otherBroadcaster.field).not.toBeDefined()
  })

  it('異なるFieldに属するbroadcasterの登録は受け付けない', () => {
    const field: Field = new FieldBuilder(scene).build()
    const otherField: Field = new FieldBuilder(scene).build()
    otherField.addBroadcaster(broadcaster)
    expect(() => field.addBroadcaster(broadcaster)).toThrow()
    expect(otherField.broadcaster).toBe(broadcaster)
    expect(broadcaster.field).toBe(otherField)
  })

  it('特定のSpot(spot1)以外のSpot(spot2)を目的地として設定できないようになる', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    expect(spot1.status).toBe('enabled')
    expect(spot2.status).toBe('enabled')
    field.disableSpotExcept(spot1)
    expect(spot1.status).toBe('enabled')
    expect(spot2.status).toBe('disabled')
  })

  it('特定のSpot(spot1)以外のSpot(spot2)が訪問可能になる', () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addBroadcaster(broadcaster)
    broadcaster.departTo(spot1)
    expect(spot1.status).toBe('target')
    expect(spot2.status).toBe('disabled')
    field.enableSpotExcept(spot1)
    expect(spot1.status).toBe('target')
    expect(spot2.status).toBe('enabled')
  })

  it('g.Eを登録すると今まで登録されたspot,broadcasterが画面に描画される', async () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addBroadcaster(broadcaster)
    expect(field.container).not.toBeDefined()
    expect(field.area).not.toBeDefined()
    await gameContext.step()
    screenshot('field.view.initial.png')
    field.container = layer1
    expect(spot1.view.parent).toBe(layer1)
    expect(spot2.view.parent).toBe(layer1)
    expect(broadcaster.view.parent).toBe(layer1)
    expect(field.area).toEqual({ x: 10, y: 10, width: 500, height: 300 })
    await gameContext.step()
    screenshot('field.view.follow.png')
  })

  it('先にg.Eを登録してからspot,broadcasterを登録しても描画される', async () => {
    const field: Field = new FieldBuilder(scene).build()
    field.container = layer1
    field.addSpot(spot1)
    field.addBroadcaster(broadcaster)
    field.addSpot(spot2)
    expect(spot1.view.parent).toBe(layer1)
    expect(spot2.view.parent).toBe(layer1)
    expect(broadcaster.view.parent).toBe(layer1)
    expect(field.area).toEqual({ x: 10, y: 10, width: 500, height: 300 })
    expect(layer1.children?.slice(1)).toEqual([spot1.view, spot2.view, broadcaster.view])
    await gameContext.step()
    screenshot('field.view.register.png')
  })

  it('viewを差し替えるとspot,broadcasterは差し替え後の方に所属する', async () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addBroadcaster(broadcaster)
    field.container = layer1
    field.container = layer2
    expect(spot1.view.parent).toBe(layer2)
    expect(spot2.view.parent).toBe(layer2)
    expect(broadcaster.view.parent).toBe(layer2)
    expect(field.area).toEqual({ x: 520, y: 20, width: 600, height: 600 })
    await gameContext.step()
    screenshot('field.view.change.png')
  })

  it('viewが削除されるとspot,broadcasterも孤立する', async () => {
    const field: Field = new FieldBuilder(scene).build()
    field.addSpot(spot1)
    field.addSpot(spot2)
    field.addBroadcaster(broadcaster)
    field.container = layer1
    field.container = undefined
    expect(spot1.view.parent).not.toBeDefined()
    expect(spot2.view.parent).not.toBeDefined()
    expect(broadcaster.view.parent).not.toBeDefined()
    expect(field.area).not.toBeDefined()
    await gameContext.step()
    screenshot('field.view.remove.png')
  })

  it('自由に値を追加・参照できる', () => {
    const field = new FieldBuilder(scene).build()
    expect(field.vars).not.toBeDefined()
    field.vars = 'Hello'
    expect(field.vars).toBe('Hello')
  })
})
