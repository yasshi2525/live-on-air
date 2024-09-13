import { LayerBuilder, Layer } from '../../src'
import { image } from '../../src/util/loader'
import { LayerType, layerTypes } from '../../src/value/layerConfig'

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
  it('デフォルトの設定を変更できる', () => {
    const def = LayerBuilder.getDefault(scene)
    expect(def.field()).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    def.field({ x: 1, y: 2, width: 100, height: 200 })
    expect(def.field()).toEqual({ x: 1, y: 2, width: 100, height: 200 })
    const lb = new LayerBuilder(scene)
    expect(lb.field()).toEqual({ x: 1, y: 2, width: 100, height: 200 })
  })

  it('デフォルトの設定で構築できる', async () => {
    const lb = new LayerBuilder(scene)
    const layer = lb.build()
    expect(lb.field()).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    expect(lb.screen()).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    expect(lb.comment()).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    for (const typ of ['field', 'screen'] as LayerType[]) {
      expect(layer[typ]).toBeDefined()
      expect(layer[typ]).toBeInstanceOf(g.E)
    }
    expect(scene.children).toEqual([layer.field, layer.screen, layer.comment])

    insertDebugView(layer)
    await gameContext.step()
    screenshot('layer-builder.default.png')
  })

  it('各レイヤの大きさをカスタマイズできる', async () => {
    const lb = new LayerBuilder(scene)
      .field({ x: 100, y: 100, width: 500, height: 500 })
      .screen({ x: 200, y: 200, width: 400, height: 400 })
      .comment({ x: 300, y: 300, width: 300, height: 300 })
    expect(lb.field()).toEqual({ x: 100, y: 100, width: 500, height: 500 })
    expect(lb.screen()).toEqual({ x: 200, y: 200, width: 400, height: 400 })
    expect(lb.comment()).toEqual({ x: 300, y: 300, width: 300, height: 300 })
    const layer = lb.build()
    expect(layer.field).toMatchObject({ x: 100, y: 100, width: 500, height: 500 })
    expect(layer.screen).toMatchObject({ x: 200, y: 200, width: 400, height: 400 })
    expect(layer.comment).toMatchObject({ x: 300, y: 300, width: 300, height: 300 })

    insertDebugView(layer)
    await gameContext.step()
    screenshot('layer-builder.custom.png')
  })
})
