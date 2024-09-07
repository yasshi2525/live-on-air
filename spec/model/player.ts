import { FieldBuilder, Field, PlayerBuilder, Spot, SpotBuilder, LayerBuilder, ScreenBuilder, Screen } from '../../src'
import { SimpleLive, waitFor } from '../__helper'
import { SampleLive } from '../../src/model/live'

describe('Player', () => {
  let field1: Field
  let field2: Field
  let sb: SpotBuilder
  let screen: Screen
  let spot1: Spot
  let spot2: Spot

  beforeEach(() => {
    field1 = new FieldBuilder().build()
    field2 = new FieldBuilder().build()
    sb = new SpotBuilder(scene)
    spot1 = sb.location({ x: 100, y: 0 }).build()
    spot2 = sb.location({ x: 0, y: 100 }).build()
    field1.addSpot(spot1)
    field1.addSpot(spot2)
    const layer = new LayerBuilder(scene)
      .field({ x: 0, y: 0, width: 1280, height: 720 })
      .build()
    field1.view = layer.field
    screen = new ScreenBuilder(scene).build()
    screen.addSpot(spot1)
    screen.addSpot(spot2)
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

  it('目的地が設定されると、それに向かって移動を開始する', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    expect(player.status).toBe('stopping')
    expect(player.location).toEqual({ x: 0, y: 0 })
    player.departTo(spot1)
    await gameContext.step()
    expect(player.location!.x).toBeGreaterThan(0)
    screenshot('player.moving.started.png')
  })

  it('目的地に到達すると移動を停止する', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    const goal = await waitFor(player.onEnter)
    expect(goal).toBe(spot1)
    expect(player.location).toEqual(spot1.location)
    expect(player.status).toBe('on-air')
    screenshot('player.moving.entered.png')
  })

  it('目的地に到達すると他のスポットへも移動可能になる', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    await waitFor(player.onEnter)
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('enabled')
  })

  it('Spotに滞在中ならば他のSpotに向かって移動開始できる', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    const s = await waitFor(player.onEnter)
    expect(s).toEqual(spot1)
    expect(player.status).toBe('on-air')
    await waitFor(player.onLiveEnd)
    expect(player.status).toBe('staying')
    player.departTo(spot2)
    await gameContext.step()
    expect(player.status).toBe('moving')
    expect(player.location!.y).toBeGreaterThan(0)
    expect(spot1.status).toEqual('disabled')
    expect(spot2.status).toEqual('target')
    screenshot('player.moving.restarted.png')
  })

  it('同じSpotを目的地にすると、次のstepで即時到着イベントが発生する', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    const s = await waitFor(player.onEnter)
    await waitFor(player.onLiveEnd)
    expect(s).toEqual(spot1)
    let goal: Spot | undefined
    player.onEnter.add(s => { goal = s })
    expect(goal).not.toBeDefined()
    player.departTo(spot1)
    expect(player.status).toBe('moving')
    expect(goal).not.toBeDefined()
    expect(spot1.status).toEqual('target')
    expect(spot2.status).toEqual('disabled')
    await gameContext.step()
    expect(goal).toBe(spot1)
    expect(player.status).toBe('on-air')
    expect(spot1.status).toEqual('enabled')
    expect(spot2.status).toEqual('enabled')
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

  it('stop()が実行されたら移動処理も中止される', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    await gameContext.step()
    await gameContext.step()
    const location = { ...player.location }
    player.stop()
    expect(player.location).toEqual(location)
    await gameContext.step()
    expect(player.location).toEqual(location)
    screenshot('player.moving.stop.png')
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
    expect(player.status).toEqual('on-air')
  })

  it('fieldに配置されていないspotには移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    const freeSpot = sb.build()
    freeSpot.attach(screen)
    expect(() => player.jumpTo(freeSpot)).toThrow()
    expect(() => player.departTo(freeSpot)).toThrow()
  })

  it('screenを登録していないspotには移動できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    const freeSpot = sb.build()
    freeSpot.deployOn(field1)
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

  it('fieldに配置されていないと生放送できない', () => {
    const player = new PlayerBuilder(scene).build()
    expect(() => player.goToLive(new SampleLive())).toThrow()
    expect(() => player.backFromLive()).toThrow()
  })

  it('移動中は生放送を開始できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.departTo(spot1)
    expect(() => player.goToLive(new SimpleLive())).toThrow()
  })

  it('stayingと型が違う生放送は開始できない', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.jumpTo(spot1)
    expect(() => player.goToLive(new SimpleLive())).toThrow()
  })

  it('放送中の場合、放送への遷移に失敗する', () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    player.jumpTo(spot1)
    expect(player.live).toBeDefined()
    expect(() => player.goToLive(new SampleLive())).toThrow()
  })

  it('放送中でない場合、放送からの復帰に失敗する', async () => {
    const player = new PlayerBuilder(scene).build()
    player.standOn(field1)
    expect(() => player.backFromLive()).toThrow()
    player.jumpTo(spot1)
    await waitFor(player.onLiveEnd)
    expect(() => player.backFromLive()).toThrow()
  })
})
