import {
  Field,
  FieldBuilder,
  LayerBuilder,
  Live,
  LiveContext,
  Player,
  PlayerBuilder,
  Screen,
  ScreenBuilder,
  Spot,
  SpotBuilder
} from '../../src'
import { waitFor } from '../__helper'

const logger = jest.spyOn(console, 'log').mockImplementation()

class SimpleLive implements Live {
  vars?: unknown
  readonly onEnd = new g.Trigger()

  static numOfLive = 0

  constructor () {
    SimpleLive.numOfLive++
  }

  start (context: LiveContext) {
    console.log(`start ${SimpleLive.numOfLive}th live`)
    context.view.append(new g.FilledRect({
      scene,
      width: context.view.width,
      height: context.view.height,
      cssColor: '#ffffaa',
      opacity: 0.25
    }))
    scene.setTimeout(() => {
      console.log(`end ${SimpleLive.numOfLive}th live`)
      this.onEnd.fire()
    }, 5000)
  }
}

class LiveNoConstructor implements Live {
  readonly onEnd = new g.Trigger()
  start () {
    console.log('start LiveNoConstructor live')
    scene.setTimeout(() => {
      console.log('end LiveNoConstructor live')
      this.onEnd.fire()
    }, 5000)
  }
}

class FlushLive implements Live {
  readonly onEnd = new g.Trigger()
  start () {
    this.onEnd.fire()
  }
}

class FlyingLive implements Live {
  readonly onEnd = new g.Trigger()
  constructor () {
    this.onEnd.fire()
  }

  start () {
    this.onEnd.fire()
  }
}

describe('screen', () => {
  let sb: SpotBuilder
  let scb: ScreenBuilder
  let field: Field
  let player: Player
  let screen: Screen

  beforeEach(() => {
    player = new PlayerBuilder(scene).build()
    sb = new SpotBuilder(scene)
    scb = new ScreenBuilder(scene)
    field = new FieldBuilder().build()
    const layer = new LayerBuilder(scene).build()
    field.view = layer.field
    player.standOn(field)
    screen = scb.build()
    screen.view = layer.screen
  })

  afterEach(() => {
    SimpleLive.numOfLive = 0
  })

  it('spotを登録していると訪問時に生放送インスタンスが生成される', async () => {
    const spot: Spot = sb.liveClass(SimpleLive).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(SimpleLive)
    expect(logger).toHaveBeenCalledWith('start 1th live')
    expect(logger).not.toHaveBeenCalledWith('end 1th live')
    await gameContext.step()
    screenshot('live.start.by.link.png')
  })

  it('Spotインスタンスに登録しても生放送は始まる', async () => {
    const spot: Spot = sb.liveClass(SimpleLive).build()
    spot.attach(screen)
    spot.deployOn(field)
    player.jumpTo(spot)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(SimpleLive)
    await gameContext.step()
    screenshot('live.start.by.attach.png')
  })

  it('放送が始まるとplayerは非表示、放送が終わるとplayerは表示', async () => {
    const spot: Spot = sb.liveClass(SimpleLive).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    expect(player.status).toBe('on-air')
    expect(player.view.visible()).toBeFalsy()
    const live: Live = screen.nowOnAir!
    await gameContext.step()
    screenshot('live.player.on-air.png')
    await waitFor(live.onEnd)
    expect(player.status).toBe('staying-in-spot')
    expect(player.view.visible()).toBeTruthy()
    expect(logger).toHaveBeenCalledWith('end 1th live')
    screenshot('live.player.off-air.png')
  })

  it('コンストラクタのないliveはインスタンス化できる', () => {
    const spot: Spot = sb.liveClass(LiveNoConstructor).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(LiveNoConstructor)
  })

  it('一瞬で終わるLiveも生成可能', () => {
    const spot: Spot = sb.liveClass(FlushLive).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    expect(screen.nowOnAir).not.toBeDefined()
    expect(player.status).toBe('staying-in-spot')
    expect(player.view.visible()).toBeTruthy()
  })

  it('放送開始前にonEnd.fireしても無視', () => {
    const spot: Spot = sb.liveClass(FlyingLive).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    expect(() => player.jumpTo(spot)).not.toThrow()
  })

  it('同じクラスインスタンスなら二重登録しても無視', () => {
    const spot: Spot = sb.build()
    spot.attach(screen)
    screen.addSpot(spot)
  })

  it('screenがattachされているspotへの別のscreen attachは不可', () => {
    const spot: Spot = sb.build()
    const other = new ScreenBuilder(scene).build()
    spot.attach(screen)
    expect(() => spot.attach(other)).toThrow()
    expect(() => other.addSpot(spot)).toThrow()
  })

  it('spotに到着していないと放送開始できない', () => {
    const spot: Spot = sb.build()
    spot.deployOn(field)
    spot.attach(screen)
    screen.addSpot(spot)
    expect(() => screen.startLive(player)).toThrow()
  })

  it('放送中に放送開始できない', () => {
    const spot: Spot = sb.build()
    spot.deployOn(field)
    spot.attach(screen)
    screen.addSpot(spot)
    player.jumpTo(spot)
    expect(player.status).toBe('on-air')
    expect(() => screen.startLive(player)).toThrow()
  })

  it('viewを登録すると、画面に描画される', async () => {
    const screen2 = scb.build()
    const spot: Spot = sb.build()
    spot.deployOn(field)
    spot.attach(screen2)
    player.jumpTo(spot)
    expect(screen2.view).not.toBeDefined()
    expect(screen2.area).not.toBeDefined()
    await gameContext.step()
    screenshot('screen.view.init.png')
    screen2.view = new g.E({ scene, parent: scene, width: 500, height: 500 })
    expect(screen2.view.parent).toBe(scene)
    expect(screen2.area).toEqual({ x: 0, y: 0, width: 500, height: 500 })
    await gameContext.step()
    screenshot('screen.view.register.png')
  })

  it('viewの登録を解除すると画面に表示されなくなる', async () => {
    const screen2 = scb.build()
    const spot: Spot = sb.build()
    spot.deployOn(field)
    spot.attach(screen2)
    player.jumpTo(spot)
    screen2.view = new g.E({ scene, parent: scene, width: 500, height: 500 })
    const view = screen2.view.children![0]
    screen2.view = undefined
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

  it('liveに自由に値を追加・参照できる', () => {
    const spot: Spot = sb.liveClass(SimpleLive).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    const live = player.live!
    expect(live.vars).not.toBeDefined()
    live.vars = 'Hello'
    expect(live.vars).toBe('Hello')
  })

  it('vars のないliveでも自由に値を追加・参照できる', () => {
    const spot: Spot = sb.liveClass(LiveNoConstructor).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
    const live = player.live!
    expect(live.vars).not.toBeDefined()
    live.vars = 'Hello'
    expect(live.vars).toBe('Hello')
  })

  it('liveContextでも自由に値を追加・参照できる', () => {
    const spot: Spot = sb.liveClass(class implements Live {
      readonly onEnd = new g.Trigger()
      start (context: LiveContext) {
        expect(context.vars).not.toBeDefined()
        context.vars = 'Hello'
        expect(context.vars).toBe('Hello')
      }
    }).build()
    screen.addSpot(spot)
    spot.deployOn(field)
    player.jumpTo(spot)
  })
})
