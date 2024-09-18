import { FieldBuilder, Field, BroadcasterBuilder, Spot, SpotBuilder, LayerBuilder, ScreenBuilder, Screen } from '../../src'
import { SimpleLive, waitFor } from '../__helper'
import { SampleLive } from '../../src/model/live'

describe('Broadcaster', () => {
  let field1: Field
  let field2: Field
  let sb: SpotBuilder
  let screen: Screen
  let spot1: Spot
  let spot2: Spot

  beforeEach(() => {
    field1 = new FieldBuilder(scene).build()
    field2 = new FieldBuilder(scene).build()
    sb = new SpotBuilder(scene)
    spot1 = sb.location({ x: 100, y: 0 }).build()
    spot2 = sb.location({ x: 0, y: 100 }).build()
    field1.addSpot(spot1)
    field1.addSpot(spot2)
    const layer = new LayerBuilder(scene)
      .field({ x: 0, y: 0, width: 1280, height: 720 })
      .build()
    field1.container = layer.field
    screen = new ScreenBuilder(scene).build()
    screen.addSpot(spot1)
    screen.addSpot(spot2)
  })

  it('fieldに入場できる', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(broadcaster.field).not.toBeDefined()
    expect(broadcaster.location).not.toBeDefined()
    expect(broadcaster.status).toBe('non-field')
    broadcaster.standOn(field1)
    expect(broadcaster.field).toBe(field1)
    expect(broadcaster.location).toBeDefined()
    expect(broadcaster.status).toBe('stopping-on-ground')
  })

  it('同じFieldへの二重登録時は警告だけで何もしない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.standOn(field1)
    expect(broadcaster.field).toBe(field1)
    expect(field1.broadcaster).toBe(broadcaster)
  })

  it('他のFieldには配置できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    expect(() => broadcaster.standOn(field2)).toThrow()
    expect(broadcaster.field).toBe(field1)
    expect(field1.broadcaster).toBe(broadcaster)
    expect(field2.broadcaster).not.toBeDefined()
  })

  it('指定した目的地(spot1)に移動できる', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    expect(broadcaster.destination).toBe(spot1)
    expect(broadcaster.status).toBe('moving')
    expect(spot1.status).toBe('target')
    expect(spot2.status).toBe('disabled')
  })

  it('目的地が設定されると、それに向かって移動を開始する', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    expect(broadcaster.status).toBe('stopping-on-ground')
    expect(broadcaster.location).toEqual({ x: 0, y: 0 })
    broadcaster.departTo(spot1)
    await gameContext.step()
    expect(broadcaster.location!.x).toBeGreaterThan(0)
    screenshot('broadcaster.moving.started.png')
  })

  it('目的地に到達すると移動を停止する', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    const goal = await waitFor(broadcaster.onEnter)
    expect(goal).toBe(spot1)
    expect(broadcaster.location).toEqual(spot1.location)
    expect(broadcaster.status).toBe('on-air')
    screenshot('broadcaster.moving.entered.png')
  })

  it('目的地に到達すると放送開始のため無効になる。放送終了後、他のスポットへも移動可能になる', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    await waitFor(broadcaster.onEnter)
    expect(spot1.status).toBe('disabled')
    expect(spot2.status).toBe('disabled')
    await waitFor(broadcaster.onLiveEnd)
    expect(spot1.status).toBe('enabled')
    expect(spot2.status).toBe('enabled')
  })

  it('Spotに滞在中ならば他のSpotに向かって移動開始できる', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    const s = await waitFor(broadcaster.onEnter)
    expect(s).toEqual(spot1)
    expect(broadcaster.status).toBe('on-air')
    await waitFor(broadcaster.onLiveEnd)
    expect(broadcaster.status).toBe('staying-in-spot')
    broadcaster.departTo(spot2)
    await gameContext.step()
    expect(broadcaster.status).toBe('moving')
    expect(broadcaster.location!.y).toBeGreaterThan(0)
    expect(spot1.status).toBe('disabled')
    expect(spot2.status).toBe('target')
    screenshot('broadcaster.moving.restarted.png')
  })

  it('同じSpotを目的地にすると、次のstepで即時到着イベントが発生する', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    const s = await waitFor(broadcaster.onEnter)
    await waitFor(broadcaster.onLiveEnd)
    expect(s).toEqual(spot1)
    let goal: Spot | undefined
    broadcaster.onEnter.add(s => { goal = s })
    expect(goal).not.toBeDefined()
    broadcaster.departTo(spot1)
    expect(broadcaster.status).toBe('moving')
    expect(goal).not.toBeDefined()
    expect(spot1.status).toBe('target')
    expect(spot2.status).toBe('disabled')
    await gameContext.step()
    expect(goal).toBe(spot1)
    expect(broadcaster.status).toBe('on-air')
    expect(spot1.status).toBe('disabled')
    expect(spot2.status).toBe('disabled')
  })

  it('移動中の場合、移動をキャンセルできる', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    broadcaster.stop()
    expect(broadcaster.destination).not.toBeDefined()
    expect(broadcaster.status).toBe('stopping-on-ground')
    expect(spot1.status).toBe('enabled')
    expect(spot2.status).toBe('enabled')
  })

  it('stop()が実行されたら移動処理も中止される', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    await gameContext.step()
    await gameContext.step()
    const location = { ...broadcaster.location }
    broadcaster.stop()
    expect(broadcaster.location).toEqual(location)
    await gameContext.step()
    expect(broadcaster.location).toEqual(location)
    screenshot('broadcaster.moving.stop.png')
  })

  it('fieldに配置されていないと移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(() => broadcaster.jumpTo(spot1)).toThrow()
    expect(() => broadcaster.departTo(spot1)).toThrow()
    expect(() => broadcaster.stop()).toThrow()
  })

  it('指定した位置に即時移動できる', () => {
    let goal: Spot | undefined
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.onEnter.add(s => { goal = s })
    broadcaster.standOn(field1)
    broadcaster.jumpTo(spot1)
    expect(goal).toBe(spot1)
    expect(broadcaster.staying).toBe(spot1)
    expect(broadcaster.location).toEqual(spot1.location)
    expect(broadcaster.status).toBe('on-air')
  })

  it('fieldに配置されていないspotには移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    const freeSpot = sb.build()
    freeSpot.attach(screen)
    expect(() => broadcaster.jumpTo(freeSpot)).toThrow()
    expect(() => broadcaster.departTo(freeSpot)).toThrow()
  })

  it('screenを登録していないspotには移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    const freeSpot = sb.build()
    freeSpot.deployOn(field1)
    expect(() => broadcaster.jumpTo(freeSpot)).toThrow()
    expect(() => broadcaster.departTo(freeSpot)).toThrow()
  })

  it('異なるfieldのspotには移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    const otherSpot = sb.build()
    otherSpot.deployOn(field2)
    expect(() => broadcaster.jumpTo(otherSpot)).toThrow()
    expect(() => broadcaster.departTo(otherSpot)).toThrow()
  })

  it('移動中は移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    expect(() => broadcaster.departTo(spot2)).toThrow()
    expect(() => broadcaster.jumpTo(spot2)).toThrow()
    expect(broadcaster.destination).toBe(spot1)
    expect(broadcaster.staying).not.toBeDefined()
  })

  it('停止中は移動停止できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    expect(() => broadcaster.stop()).toThrow()
    expect(broadcaster.status).toBe('stopping-on-ground')
  })

  it('移動速度を設定できる', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(broadcaster.speed).toBe(1)
    broadcaster.speed = 2
    expect(broadcaster.speed).toBe(2)
  })

  it('負の速度は設定できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(() => {
      broadcaster.speed = 0
    }).toThrow()
    expect(() => {
      broadcaster.speed = -1
    }).toThrow()
    expect(broadcaster.speed).toBe(1)
  })

  it('fieldに配置されていないと生放送できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(() => broadcaster.goToLive(new SampleLive())).toThrow()
    expect(() => broadcaster.backFromLive()).toThrow()
  })

  it('移動中は生放送を開始できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.departTo(spot1)
    expect(() => broadcaster.goToLive(new SimpleLive())).toThrow()
  })

  it('stayingと型が違う生放送は開始できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.jumpTo(spot1)
    expect(() => broadcaster.goToLive(new SimpleLive())).toThrow()
  })

  it('放送中の場合、放送への遷移に失敗する', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.jumpTo(spot1)
    expect(broadcaster.live).toBeDefined()
    expect(() => broadcaster.goToLive(new SampleLive())).toThrow()
  })

  it('放送中は移動できない', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    broadcaster.jumpTo(spot1)
    spot2.enable()
    expect(() => broadcaster.departTo(spot2)).toThrow()
    expect(() => broadcaster.jumpTo(spot2)).toThrow()
  })

  it('放送中でない場合、放送からの復帰に失敗する', async () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    expect(() => broadcaster.backFromLive()).toThrow()
    broadcaster.jumpTo(spot1)
    await waitFor(broadcaster.onLiveEnd)
    expect(() => broadcaster.backFromLive()).toThrow()
  })

  it('自由に値を追加・参照できる', () => {
    const broadcaster = new BroadcasterBuilder(scene).build()
    expect(broadcaster.vars).not.toBeDefined()
    broadcaster.vars = 'Hello'
    expect(broadcaster.vars).toBe('Hello')
  })
})
