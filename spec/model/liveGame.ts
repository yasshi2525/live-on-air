import {
  Broadcaster,
  BroadcasterBuilder,
  Field,
  FieldBuilder,
  LiveGame,
  LiveContext,
  Screen,
  ScreenBuilder,
  Spot,
  SpotBuilder, Layer, LayerBuilder
} from '../../src'
import { waitFor } from '../__helper'

class SimpleLiveGame extends LiveGame {
  readonly font = new g.DynamicFont({
    game: g.game,
    fontFamily: 'sans-serif',
    size: 50,
    strokeColor: 'white',
    strokeWidth: 4
  })

  protected evaluateScore (context: LiveContext): number {
    return (context.vars as Record<string, g.FilledRect>).gauge.width / 500 * 100
  }

  protected handleGamePlay (context : LiveContext): () => void {
    const { scene, container } = { ...context }
    const gauge = new g.FilledRect({ scene, parent: container, width: 0, height: 100, cssColor: '#aa4444' })
    context.vars = { gauge }
    gauge.onUpdate.add(() => {
      gauge.width += 500 / 120
      if (gauge.width > 500) {
        gauge.width = 0
      }
      gauge.modified()
    })
    return () => {
      gauge.destroy()
    }
  }

  protected handleIntroduction ({ scene, container }: LiveContext, next: () => void) {
    container.append(new g.FilledRect({
      scene, width: container.width, height: container.height, cssColor: '#ffffaa', opacity: 0.25
    }))
    const description = new g.Label({
      scene,
      parent: container,
      text: 'ゲージの最大値でボタンを押そう！',
      font: this.font
    })
    scene.setTimeout(() => next(), 3000)
    return () => {
      description.destroy()
    }
  }
}

describe('liveGame', () => {
  let broadcaster: Broadcaster
  let spot: Spot
  let layer: Layer
  let field: Field
  let screen: Screen

  beforeEach(() => {
    broadcaster = new BroadcasterBuilder(scene).build()
    spot = new SpotBuilder(scene).liveClass(SimpleLiveGame).build()
    layer = new LayerBuilder(scene).build()
    field = new FieldBuilder(scene).build()
    screen = new ScreenBuilder(scene).build()
    field.container = layer.field
    screen.container = layer.screen
    field.addBroadcaster(broadcaster)
    field.addSpot(spot)
    screen.addSpot(spot)
  })

  it('demo', async () => {
    broadcaster.jumpTo(spot)
    await gameContext.step()
    const live = broadcaster.live as LiveGame
    expect(live).toBeDefined()
    expect(live).toBeInstanceOf(SimpleLiveGame)
    screenshot('liveGame.start.png')
    await waitFor(live.onIntroduce)
    screenshot('liveGame.introduce.png')
    gameClient.sendPointDown(g.game.width / 2, 200, 1)
    await waitFor(live.onSubmit)
    screenshot('liveGame.submit.png')
    await waitFor(live.onResult)
    screenshot('liveGame.result.png')
    screenshot('liveGame.end.png')
  })

  it('成績がunlockThresholdを超えるとspotがクリア扱いされる', async () => {
    const otherSpot = new SpotBuilder(scene).build()
    otherSpot.deployOn(field)
    otherSpot.attach(screen)
    otherSpot.lockedBy(spot)
    broadcaster.jumpTo(spot)
    await gameContext.step()
    const live = broadcaster.live as LiveGame
    live.unlockThreshold = 0
    await waitFor(live.onIntroduce)
    gameClient.sendPointDown(g.game.width / 2, 200, 1)
    await waitFor(broadcaster.onLiveEnd)
    expect(otherSpot.lockedBy()).toHaveLength(0)
  })
})
