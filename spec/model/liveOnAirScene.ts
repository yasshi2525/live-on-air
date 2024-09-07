import { LiveOnAirSceneBuilder } from '../../src'

describe('LiveOnAirScene', () => {
  it('load 前は 要素にアクセスできない', () => {
    const scene = new LiveOnAirSceneBuilder(g.game).build()
    expect(() => scene.layer).toThrow()
    expect(() => scene.field).toThrow()
    expect(() => scene.broadcaster).toThrow()
    expect(() => scene.screen).toThrow()
    expect(() => scene.spots).toThrow()
  })
})
