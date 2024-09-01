import { LayerBuilder, Layer, LayerType } from '../../src'
import { layerTypes } from '../../src/builder/layerConfig'
import { image } from '../../src/util/loader'

const insertDebugView = (layer: Layer) => {
  for (const typ of layerTypes) {
    layer[typ].append(new g.FilledRect({
      scene,
      width: layer[typ].width,
      height: layer[typ].height,
      cssColor: '#888888',
      opacity: 0.25
    }))
    layer[typ].append(new g.Sprite({
      scene,
      src: image(scene, `image/layer.${typ}.label.png`),
      x: layer[typ].width / 2,
      anchorX: 0.5
    }))
  }
}

describe('LayerBuilder', () => {
  it('デフォルトの設定で構築できる', async () => {
    const layer = new LayerBuilder(scene).build()
    for (const typ of ['field'] as LayerType[]) {
      expect(layer[typ]).toBeDefined()
      expect(layer[typ]).toBeInstanceOf(g.E)
    }
    expect(scene.children).toEqual([layer.field])

    insertDebugView(layer)
    await gameContext.step()
    screenshot('layer-builder.default.png')
  })

  it('各レイヤの大きさをカスタマイズできる', async () => {
    const layer = new LayerBuilder(scene)
      .field({ x: 100, y: 100, width: 500, height: 500 })
      .build()
    expect(layer.field).toMatchObject({ x: 100, y: 100, width: 500, height: 500 })

    insertDebugView(layer)
    await gameContext.step()
    screenshot('layer-builder.custom.png')
  })
})
