import { SceneBuilder } from '../../src'

describe('Scene', () => {
  it('load 前は 要素にアクセスできない', () => {
    const scene = new SceneBuilder(g.game).build()
    expect(() => scene.layer).toThrow()
    expect(() => scene.field).toThrow()
    expect(() => scene.player).toThrow()
    expect(() => scene.screen).toThrow()
    expect(() => scene.spots).toThrow()
  })
})
