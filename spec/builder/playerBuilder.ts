import { PlayerBuilder } from '../../src'
import { image } from '../../src/util/loader'

describe('playerBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = PlayerBuilder.getDefault(scene)
    expect(def.location()).toEqual({ x: 0, y: 0 })
    expect(def.speed()).toEqual(1)
    expect(def.asset()).toMatchObject({ path: './image/player.default.png' })
    def.location({ x: 1, y: 2 })
    expect(def.location()).toEqual({ x: 1, y: 2 })
    const lb = new PlayerBuilder(scene)
    expect(lb.location()).toEqual({ x: 1, y: 2 })
  })
  it('デフォルトの設定で作成できる', () => {
    const pb = new PlayerBuilder(scene)
    expect(pb.speed()).toEqual(1)
    expect(pb.asset().path).toEqual('./image/player.default.png')
    expect(pb.location()).toEqual({ x: 0, y: 0 })
    const player = pb.build()
    expect(player.speed).toBe(1)
    expect(player.view).toBeInstanceOf(g.Sprite)
    expect(((player.view as g.Sprite).src as g.ImageAsset).path).toEqual('./image/player.default.png')
    expect(player.view).toMatchObject({ x: 0, y: 0 })
  })

  it('カスタム設定で作成できる', () => {
    const pb = new PlayerBuilder(scene)
      .speed(2)
      .asset(image(scene, 'image/default.png'))
      .location({ x: 100, y: 200 })
    expect(pb.speed()).toEqual(2)
    expect(pb.location()).toEqual({ x: 100, y: 200 })
    expect(pb.asset().path).toEqual('./image/default.png')
    const player = pb.build()
    expect(player.speed).toBe(2)
    expect(player.view).toBeInstanceOf(g.Sprite)
    expect(((player.view as g.Sprite).src as g.ImageAsset).path).toEqual('./image/default.png')
    expect(player.view).toMatchObject({ x: 100, y: 200 })
  })

  it('不正な値は設定できない', () => {
    const pb = new PlayerBuilder(scene)
    expect(() => pb.speed(-1)).toThrow()
    expect(pb.speed()).toBe(1)
  })
})
