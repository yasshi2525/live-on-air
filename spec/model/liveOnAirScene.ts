import { LiveOnAirSceneBuilder } from '../../src'
import { waitFor } from '../__helper'

describe('LiveOnAirScene', () => {
  it('load 前は 要素にアクセスできない', () => {
    const scene = new LiveOnAirSceneBuilder(g.game).build()
    expect(() => scene.layer).toThrow()
    expect(() => scene.field).toThrow()
    expect(() => scene.broadcaster).toThrow()
    expect(() => scene.screen).toThrow()
    expect(() => scene.spots).toThrow()
    expect(() => scene.commentSupplier).toThrow()
    expect(() => scene.commentDeployer).toThrow()
    expect(() => scene.scorer).toThrow()
  })

  it('コメント発生により加点', async () => {
    const scene = new LiveOnAirSceneBuilder(g.game).build()
    g.game.pushScene(scene)
    await waitFor(scene.onLoad)
    await waitFor(scene.commentSupplier.onSupply)
    expect(scene.scorer.score).toBe(1)
  })
})
