import { SpotAssetRecord, SpotBuilder } from '../../src'
import { SampleLive } from '../../src/model/live'
import { SimpleLive } from '../__helper'

describe('spotBuilder', () => {
  let assetKeys: (keyof SpotAssetRecord)[]
  beforeEach(() => {
    assetKeys = ['locked', 'unvisited', 'disabled', 'normal']
  })

  it('共通設定を参照できる', () => {
    expect(Object.keys(SpotBuilder.getDefault(scene).image())).toEqual(assetKeys)
    for (const typ of assetKeys) {
      expect(SpotBuilder.getDefault(scene).image()[typ].path).toBe(`./image/spot.default.${typ}.png`)
    }
    expect(SpotBuilder.getDefault(scene).location()).toEqual({ x: 0, y: 0 })
    expect(SpotBuilder.getDefault(scene).name()).toBe('')
    expect(SpotBuilder.getDefault(scene).labelFont()).toMatchObject({ size: 25 })
    expect(SpotBuilder.getDefault(scene).liveClass()).toBe(SampleLive)
  })
  it('個別設定を参照できる', () => {
    const sb = new SpotBuilder(scene)
    expect(Object.keys(sb.image())).toEqual(assetKeys)
    for (const typ of assetKeys) {
      expect(sb.image()[typ].path).toBe(`./image/spot.default.${typ}.png`)
    }
    expect(sb.location()).toEqual({ x: 0, y: 0 })
    expect(sb.name()).toBe('')
    expect(sb.labelFont()).toMatchObject({ size: 25 })
    expect(sb.liveClass()).toBe(SampleLive)
  })
  it('個別設定を上書きできる(location)', () => {
    const sb = new SpotBuilder(scene)
      .location({ x: 10, y: 20 }).location({ x: 30, y: 40 })
    expect(sb.location()).toEqual({ x: 30, y: 40 })
  })
  it('共通設定ができる', () => {
    const asset = scene.asset.getImageById('default')

    SpotBuilder.getDefault(scene)
      .image({
        locked: asset,
        unvisited: asset,
        disabled: asset,
        normal: asset
      })
      .location({ x: 100, y: 200 })
      .name('aaa')
      .labelFont(new g.DynamicFont({ game: g.game, size: 50, fontFamily: 'sans-serif' }))
      .liveClass(SimpleLive)

    for (const typ of assetKeys) {
      expect(SpotBuilder.getDefault(scene).image()[typ].path).toBe('./image/default.png')
    }
    const sb = new SpotBuilder(scene)
    for (const typ of assetKeys) {
      expect(sb.image()[typ].path).toBe('./image/default.png')
    }
    expect(SpotBuilder.getDefault(scene).location()).toEqual({ x: 100, y: 200 })
    expect(sb.location()).toEqual({ x: 100, y: 200 })
    expect(SpotBuilder.getDefault(scene).name()).toBe('aaa')
    expect(sb.name()).toBe('aaa')
    expect(SpotBuilder.getDefault(scene).labelFont()).toMatchObject({ size: 50 })
    expect(sb.labelFont()).toMatchObject({ size: 50 })
    expect(SpotBuilder.getDefault(scene).liveClass()).toBe(SimpleLive)
    expect(sb.liveClass()).toBe(SimpleLive)
  })
  it('個別設定ができる', () => {
    const sb = new SpotBuilder(scene)
    const asset = scene.asset.getImageById('default')
    sb
      .image({
        locked: asset,
        unvisited: asset,
        disabled: asset,
        normal: asset
      })
      .location({ x: 100, y: 200 })
      .name('aaa')
      .labelFont(new g.DynamicFont({ game: g.game, size: 50, fontFamily: 'sans-serif' }))
      .liveClass(SimpleLive)

    for (const typ of assetKeys) {
      expect(SpotBuilder.getDefault(scene).image()[typ].path).toBe(`./image/spot.default.${typ}.png`)
    }
    for (const typ of assetKeys) {
      expect(sb.image()[typ].path).toBe('./image/default.png')
    }
    expect(sb.location()).toEqual({ x: 100, y: 200 })
    expect(sb.name()).toBe('aaa')
    expect(sb.labelFont()).toMatchObject({ size: 50 })
    expect(sb.liveClass()).toBe(SimpleLive)
  })
  it('Spotを生成できる', () => {
    const sb = new SpotBuilder(scene).location({ x: 100, y: 200 })
    const spot = sb.build()
    expect(Object.keys(spot.assets)).toEqual(assetKeys)
    for (const typ of assetKeys) {
      expect(spot.assets[typ].path).toBe(`./image/spot.default.${typ}.png`)
    }
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.normal.png')
    expect(spot.view).toMatchObject({ x: 100, y: 200 })
    expect(spot.name).toBe('')
    expect(spot.labelFont).toMatchObject({ size: 25 })
    expect(spot.liveClass).toBe(SampleLive)
  })
  it('varsにundefinedを入れられる', () => {
    const sb = new SpotBuilder(scene)
      .vars('hoge')
      .vars(undefined)
    expect(sb.vars()).not.toBeDefined()
    const spot = sb.build()
    expect(spot.vars).not.toBeDefined()
  })
})
