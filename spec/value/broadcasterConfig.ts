import { BroadcasterConfig, BroadcasterConfigSupplier } from '../../src/value/broadcasterConfig'

describe('broadcasterConfig', () => {
  let config: BroadcasterConfigSupplier

  beforeEach(() => {
    config = new BroadcasterConfigSupplier({ x: 0, y: 0, speed: 1, asset: scene.asset.getImageById('broadcaster.default'), vars: undefined })
  })

  it('デフォルトの座標だけ更新ができる', () => {
    config.defaultIf({ x: 2, y: 3, hoge: 'foo' } as Partial<BroadcasterConfig>)
    expect(config.default()).toMatchObject({ x: 2, y: 3, speed: 1, asset: { path: './image/broadcaster.default.png' } })
  })
  it('座標だけ更新ができる', () => {
    config.setIf({ x: 2, y: 3, hoge: 'foo' } as Partial<BroadcasterConfig>)
    expect(config.get()).toMatchObject({ x: 2, y: 3, speed: 1, asset: { path: './image/broadcaster.default.png' } })
  })

  it('移動速度は正の値', () => {
    expect(() => config.defaultIf({ speed: -1 })).toThrow()
    expect(() => config.setIf({ speed: -1 })).toThrow()
  })
})
