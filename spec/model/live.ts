import {
  Broadcaster,
  BroadcasterBuilder,
  Field,
  FieldBuilder, LayerBuilder,
  Live,
  LiveContext,
  Screen, ScreenBuilder,
  Spot,
  SpotBuilder
} from '../../src'

class SimpleLive implements Live {
  vars?: unknown
  static numOfLive = 0

  constructor () {
    SimpleLive.numOfLive++
  }

  start (context: LiveContext, end: () => void): void {
    context.container.append(new g.FilledRect({
      scene,
      width: context.container.width,
      height: context.container.height,
      cssColor: '#ffffaa',
      opacity: 0.25
    }))
    scene.setTimeout(() => {
      end()
    }, 5000)
  }
}

class LiveNoConstructor implements Live {
  start (_: LiveContext, end: () => void): void {
    scene.setTimeout(() => {
      end()
    }, 5000)
  }
}

class FlushLive implements Live {
  start (_: LiveContext, end: () => void): void {
    end()
  }
}

describe('live', () => {
  let sb: SpotBuilder
  let field: Field
  let broadcaster: Broadcaster
  let screen: Screen
  let spot: Spot

  beforeEach(() => {
    broadcaster = new BroadcasterBuilder(scene).build()
    sb = new SpotBuilder(scene)
    field = new FieldBuilder().build()
    const layer = new LayerBuilder(scene).build()
    field.container = layer.field
    broadcaster.standOn(field)
    screen = new ScreenBuilder(scene).build()
    spot = sb.liveClass(LiveNoConstructor).build()
    screen.addSpot(spot)
    spot.deployOn(field)
  })

  afterEach(() => {
    SimpleLive.numOfLive = 0
  })

  it('コンストラクタのないliveはインスタンス化できる', () => {
    broadcaster.jumpTo(spot)
    expect(screen.nowOnAir).toBeDefined()
    expect(screen.nowOnAir).toBeInstanceOf(LiveNoConstructor)
  })

  it('一瞬で終わるLiveも生成可能', () => {
    const spot1 = sb.liveClass(FlushLive).build()
    screen.addSpot(spot1)
    spot1.deployOn(field)
    broadcaster.jumpTo(spot1)
    expect(screen.nowOnAir).not.toBeDefined()
    expect(broadcaster.status).toBe('staying-in-spot')
    expect(broadcaster.view.visible()).toBeTruthy()
  })

  it('liveに自由に値を追加・参照できる', () => {
    broadcaster.jumpTo(spot)
    const live = broadcaster.live!
    expect(live.vars).not.toBeDefined()
    live.vars = 'Hello'
    expect(live.vars).toBe('Hello')
  })

  it('vars のないliveでも自由に値を追加・参照できる', () => {
    broadcaster.jumpTo(spot)
    const live = broadcaster.live!
    expect(live.vars).not.toBeDefined()
    live.vars = 'Hello'
    expect(live.vars).toBe('Hello')
  })

  it('liveContextでも自由に値を追加・参照できる', () => {
    const spot1: Spot = sb.liveClass(class implements Live {
      start (context: LiveContext) {
        expect(context.vars).not.toBeDefined()
        context.vars = 'Hello'
        expect(context.vars).toBe('Hello')
      }
    }).build()
    screen.addSpot(spot1)
    spot1.deployOn(field)
    broadcaster.jumpTo(spot1)
  })
})
