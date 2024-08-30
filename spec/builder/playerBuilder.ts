import { PlayerBuilder } from '../../src'
import { image } from '../../src/util/loader'

describe('playerBuilder', () => {
  it('デフォルトの設定で作成できる', () => {
    const pb = new PlayerBuilder(scene)
    expect(pb.asset.path).toEqual('./image/player.default.png')
    const player = pb.build()
    expect(player.speed).toBe(1)
    expect(player.view).toBeInstanceOf(g.Sprite)
    expect(((player.view as g.Sprite).src as g.ImageAsset).path).toEqual('./image/player.default.png')
  })

  it('カスタム設定で作成できる', () => {
    const pb = new PlayerBuilder(scene)
    pb.speed = 2
    pb.asset = image(scene, 'image/default.png')
    expect(pb.asset.path).toEqual('./image/default.png')
    const player = pb.build()
    expect(player.speed).toBe(2)
    expect(player.view).toBeInstanceOf(g.Sprite)
    expect(((player.view as g.Sprite).src as g.ImageAsset).path).toEqual('./image/default.png')
  })

  it('不正な値は設定できない', () => {
    const pb = new PlayerBuilder(scene)
    expect(() => {
      pb.speed = -1
    }).toThrow()
    expect(pb.speed).toBe(1)
  })
})
