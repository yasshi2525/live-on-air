import { BroadcasterBuilder } from '../../src'
import { image } from '../../src/util/loader'

describe('broadcasterBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = BroadcasterBuilder.getDefault(scene)
    expect(def.location()).toEqual({ x: 0, y: 0 })
    expect(def.speed()).toEqual(1)
    expect(def.asset()).toMatchObject({ path: './image/broadcaster.default.png' })
    def.location({ x: 1, y: 2 })
    expect(def.location()).toEqual({ x: 1, y: 2 })
    const lb = new BroadcasterBuilder(scene)
    expect(lb.location()).toEqual({ x: 1, y: 2 })
  })
  it('デフォルトの設定で作成できる', () => {
    const bb = new BroadcasterBuilder(scene)
    expect(bb.speed()).toEqual(1)
    expect(bb.asset().path).toBe('./image/broadcaster.default.png')
    expect(bb.location()).toEqual({ x: 0, y: 0 })
    const broadcaster = bb.build()
    expect(broadcaster.speed).toBe(1)
    expect(broadcaster.view).toBeInstanceOf(g.Sprite)
    expect(((broadcaster.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/broadcaster.default.png')
    expect(broadcaster.view).toMatchObject({ x: 0, y: 0 })
  })

  it('カスタム設定で作成できる', () => {
    const bb = new BroadcasterBuilder(scene)
      .speed(2)
      .asset(image(scene, 'image/default.png'))
      .location({ x: 100, y: 200 })
    expect(bb.speed()).toEqual(2)
    expect(bb.location()).toEqual({ x: 100, y: 200 })
    expect(bb.asset().path).toBe('./image/default.png')
    const broadcaster = bb.build()
    expect(broadcaster.speed).toBe(2)
    expect(broadcaster.view).toBeInstanceOf(g.Sprite)
    expect(((broadcaster.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/default.png')
    expect(broadcaster.view).toMatchObject({ x: 100, y: 200 })
  })

  it('不正な値は設定できない', () => {
    const pb = new BroadcasterBuilder(scene)
    expect(() => pb.speed(-1)).toThrow()
    expect(pb.speed()).toBe(1)
  })
})
