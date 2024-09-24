import {
  Field,
  FieldBuilder,
  LayerBuilder,
  Broadcaster,
  BroadcasterBuilder,
  Screen,
  ScreenBuilder,
  Spot,
  SpotBuilder,
  LiveContext, Live
} from '../../src'
import { waitFor } from '../__helper'
import { SampleLive } from '../../src/model/live'

describe('screen', () => {
  let sb: SpotBuilder
  let scb: ScreenBuilder
  let field: Field
  let broadcaster: Broadcaster
  let screen: Screen
  let spot: Spot

  beforeEach(() => {
    broadcaster = new BroadcasterBuilder(scene).build()
    sb = new SpotBuilder(scene)
    scb = new ScreenBuilder(scene)
    field = new FieldBuilder(scene).build()
    const layer = new LayerBuilder(scene).build()
    field.container = layer.field
    broadcaster.standOn(field)
    screen = scb.build()
    spot = new SpotBuilder(scene).build()
    spot.deployOn(field)
    spot.attach(screen)
    screen.container = layer.screen
  })

  it('spotを登録していると訪問時に生放送インスタンスが生成される', async () => {
    const spot1 = sb.build()
    screen.addSpot(spot1)
    spot1.deployOn(field)
    broadcaster.jumpTo(spot1)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(SampleLive)
    expect(broadcaster.live).toBeDefined()
    expect(broadcaster.live).toBeInstanceOf(SampleLive)
    await gameContext.step()
    screenshot('screen.start.by.add.spot.png')
  })

  it('Spotインスタンスに登録しても生放送は始まる', async () => {
    const spot1 = sb.build()
    spot1.attach(screen)
    spot1.deployOn(field)
    broadcaster.jumpTo(spot1)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(SampleLive)
    expect(broadcaster.live).toBeDefined()
    expect(broadcaster.live).toBeInstanceOf(SampleLive)
    await gameContext.step()
    screenshot('screen.start.by.attach.png')
  })

  it('放送が始まるとbroadcasterは非表示、放送が終わるとbroadcasterは表示', async () => {
    broadcaster.jumpTo(spot)
    expect(broadcaster.status).toBe('on-air')
    expect(broadcaster.view.visible()).toBeFalsy()
    await gameContext.step()
    screenshot('screen.broadcaster.on-air.png')
    await waitFor(broadcaster.onLiveEnd)
    expect(broadcaster.status).toBe('staying-in-spot')
    expect(broadcaster.view.visible()).toBeTruthy()
    screenshot('screen.broadcaster.off-air.png')
  })

  it('liveContextに初期値を与えられる', async () => {
    let liveContext: LiveContext | undefined
    const spot1 = sb.liveClass(class implements Live {
      start (context: LiveContext, next: () => void): void {
        liveContext = context
        next()
      }
    }).build()
    spot1.attach(screen)
    spot1.deployOn(field)
    screen.customLiveContext = { vars: 'hoge' }
    broadcaster.jumpTo(spot1)
    await gameContext.step()
    expect(liveContext!.vars).toEqual('hoge')
  })

  it('放送が終わるとspotは解放される', async () => {
    broadcaster.jumpTo(spot)
    const otherSpot = new SpotBuilder(scene).build()
    otherSpot.deployOn(field)
    otherSpot.attach(screen)
    otherSpot.lockedBy(spot)
    expect(otherSpot.lockedBy()).toHaveLength(1)
    await waitFor(broadcaster.onLiveEnd)
    expect(otherSpot.lockedBy()).toHaveLength(0)
  })

  it('同じクラスインスタンスなら二重登録しても無視', () => {
    spot.attach(screen)
    screen.addSpot(spot)
  })

  it('screenがattachされているspotへの別のscreen attachは不可', () => {
    const other = new ScreenBuilder(scene).build()
    expect(() => spot.attach(other)).toThrow()
    expect(() => other.addSpot(spot)).toThrow()
  })

  it('spotに到着していないと放送開始できない', () => {
    screen.addSpot(spot)
    expect(() => screen.startLive(broadcaster)).toThrow()
  })

  it('fieldにいないと放送開始できない', () => {
    const b = new BroadcasterBuilder(scene).build()
    expect(b.field).not.toBeDefined()
    expect(() => screen.startLive(b)).toThrow()
  })

  it('放送中に放送開始できない', () => {
    screen.addSpot(spot)
    broadcaster.jumpTo(spot)
    expect(broadcaster.status).toBe('on-air')
    expect(() => screen.startLive(broadcaster)).toThrow()
  })

  it('viewを登録すると、画面に描画される', async () => {
    const screen2 = scb.build()
    broadcaster.jumpTo(spot)
    expect(screen2.container).not.toBeDefined()
    expect(screen2.area).not.toBeDefined()
    await gameContext.step()
    screenshot('screen.view.init.png')
    screen2.container = new g.E({ scene, parent: scene, width: 500, height: 500 })
    expect(screen2.container.parent).toBe(scene)
    expect(screen2.area).toEqual({ x: 0, y: 0, width: 500, height: 500 })
    await gameContext.step()
    screenshot('screen.view.register.png')
  })

  it('viewの登録を解除すると画面に表示されなくなる', async () => {
    const screen2 = scb.build()
    broadcaster.jumpTo(spot)
    screen2.container = new g.E({ scene, parent: scene, width: 500, height: 500 })
    const view = screen2.container.children![0]
    screen2.container = undefined
    expect(view.parent).not.toBeDefined()
    expect(screen2.area).not.toBeDefined()
    await gameContext.step()
    screenshot('screen.view.clear.png')
  })

  it('自由に値を追加・参照できる', () => {
    expect(screen.vars).not.toBeDefined()
    screen.vars = 'Hello'
    expect(screen.vars).toBe('Hello')
  })
})
