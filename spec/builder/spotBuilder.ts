import { SpotBuilder } from '../../src'
import { spotImageTypes } from '../../src/builder/spotConfig'

describe('spotBuilder', () => {
  it('共通設定を参照できる', () => {
    const sb = new SpotBuilder(scene)
    expect(Object.keys(sb.default.images)).toEqual(spotImageTypes)
    expect(sb.default.defaultImage.path).toEqual('./image/spot.default.png')
    for (const typ of spotImageTypes) {
      expect(sb.default.images[typ].path).toEqual(`./image/spot.default.${typ}.png`)
    }
  })
  it('個別設定を参照できる', () => {
    const sb = new SpotBuilder(scene)
    expect(Object.keys(sb.images)).toEqual(spotImageTypes)
    for (const typ of spotImageTypes) {
      expect(sb.images[typ].path).toEqual(`./image/spot.default.${typ}.png`)
    }
  })
  it('共通設定ができる', () => {
    const sb = new SpotBuilder(scene)
    const asset = scene.asset.getImageById('default')

    sb.default.image({
      locked: asset,
      unvisited: asset,
      disabled: asset,
      normal: asset
    })

    expect(sb.default.defaultImage.path).toEqual('./image/spot.default.png')
    for (const typ of spotImageTypes) {
      expect(sb.default.images[typ].path).toEqual('./image/default.png')
    }
    for (const typ of spotImageTypes) {
      expect(sb.images[typ].path).toEqual('./image/default.png')
    }
  })
  it('デフォルトのデフォルト値を変更できる', () => {
    const sb = new SpotBuilder(scene)
    sb.default.defaultImage = scene.asset.getImageById('default')
    expect(sb.default.defaultImage.path).toEqual('./image/default.png')
  })
  it('個別設定ができる', () => {
    const sb = new SpotBuilder(scene)
    const asset = scene.asset.getImageById('default')
    sb.image({
      locked: asset,
      unvisited: asset,
      disabled: asset,
      normal: asset
    })
    expect(sb.default.defaultImage.path).toEqual('./image/spot.default.png')
    for (const typ of spotImageTypes) {
      expect(sb.default.images[typ].path).toEqual(`./image/spot.default.${typ}.png`)
    }
    for (const typ of spotImageTypes) {
      expect(sb.images[typ].path).toEqual('./image/default.png')
    }
  })
  it('Spotを生成できる', () => {
    const sb = new SpotBuilder(scene)
    const spot = sb.build()
    expect(Object.keys(spot.assets)).toEqual(spotImageTypes)
    for (const typ of spotImageTypes) {
      expect(spot.assets[typ].path).toEqual(`./image/spot.default.${typ}.png`)
    }
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toEqual('./image/spot.default.normal.png')
  })
})
