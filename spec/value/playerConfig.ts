import { PlayerConfig, PlayerConfigSupplier } from '../../src/value/playerConfig'

describe('playerConfig', () => {
  let config: PlayerConfigSupplier

  beforeEach(() => {
    config = new PlayerConfigSupplier({ x: 0, y: 0, speed: 1, asset: scene.asset.getImageById('player.default') })
  })

  it('デフォルトの座標だけ更新ができる', () => {
    config.defaultIf({ x: 2, y: 3, hoge: 'foo' } as Partial<PlayerConfig>)
    expect(config.default()).toMatchObject({ x: 2, y: 3, speed: 1, asset: { path: './image/player.default.png' } })
  })
  it('座標だけ更新ができる', () => {
    config.setIf({ x: 2, y: 3, hoge: 'foo' } as Partial<PlayerConfig>)
    expect(config.get()).toMatchObject({ x: 2, y: 3, speed: 1, asset: { path: './image/player.default.png' } })
  })

  it('移動速度は正の値', () => {
    expect(() => config.defaultIf({ speed: -1 })).toThrow()
    expect(() => config.setIf({ speed: -1 })).toThrow()
  })
})
