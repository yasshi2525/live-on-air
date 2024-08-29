import { LayerBuilder } from '../../src/builder/layerBuilder'
import { LayerType } from '../../src/builder/layerConfig'

describe('LayerBuilder', () => {
  it('デフォルトの設定で構築できる', () => {
    const layer = new LayerBuilder(scene).build()
    for (const typ of ['field'] as LayerType[]) {
      expect(layer[typ]).toBeDefined()
      expect(layer[typ]).toBeInstanceOf(g.E)
    }
    expect(scene.children).toEqual([layer.field])
    gameContext.step()
    screenshot('layer-builder.default.png')
  })

  it('各レイヤの大きさをカスタマイズできる', () => {
    const layer = new LayerBuilder(scene)
      .field({ x: 100, y: 100, width: 500, height: 500 })
      .build()
    expect(layer.field).toMatchObject({ x: 100, y: 100, width: 500, height: 500 })
    gameContext.step()
    screenshot('layer-builder.custom.png')
  })
})
