import { LiveOnAirSceneBuilder, LiveOnAirSceneConfigure, SpotAssetRecord, SpotAssetType } from '../../src'
import { LiveOnAirSceneImpl } from '../../src/model/liveOnAirScene'

describe('liveOnAirSceneBuilder', () => {
  let _default: LiveOnAirSceneConfigure
  let spotAssets: SpotAssetRecord
  let matchSpotAssets: Record<SpotAssetType, { path: string }>

  beforeEach(() => {
    _default = LiveOnAirSceneBuilder.getDefault(g.game)
    spotAssets = {
      locked: scene.asset.getImageById('spot.default.locked'),
      unvisited: scene.asset.getImageById('spot.default.unvisited'),
      normal: scene.asset.getImageById('spot.default.normal'),
      disabled: scene.asset.getImageById('spot.default.disabled')
    }
    matchSpotAssets = {
      locked: { path: './image/spot.default.locked.png' },
      unvisited: { path: './image/spot.default.unvisited.png' },
      normal: { path: './image/spot.default.normal.png' },
      disabled: { path: './image/spot.default.disabled.png' }
    }
  })

  afterEach(async () => {
    if (g.game.scene() instanceof LiveOnAirSceneImpl) {
      g.game.popScene()
      await gameContext.step()
    }
  })
  it('デフォルトのデフォルト値は自動で付与される', () => {
    _default
      .layer({})
      .field({})
      .broadcaster({})
      .screen({})
      .spot({})
      .commentSupplier({})
      .commentDeployer({})
    expect(_default.layer()).toEqual({
      field: { x: 100, y: 100, width: 1080, height: 520 },
      screen: { x: 100, y: 100, width: 1080, height: 520 },
      comment: { x: 100, y: 100, width: 1080, height: 520 }
    })
    expect(_default.field()).toEqual({})
    expect(_default.broadcaster()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/broadcaster.default.png' } })
    expect(_default.screen()).toEqual({})
    expect(_default.spot()).toHaveLength(1)
    expect(_default.spot()[0]).toMatchObject({ x: 0, y: 0, ...matchSpotAssets })
    expect(_default.commentSupplier()).toMatchObject({ interval: 1000, comments: [] })
    expect(_default.commentDeployer()).toMatchObject({ speed: 1, intervalY: 40, font: { size: 35 } })
  })
  it('デフォルト要素が自動で定義される', () => {
    expect(_default.layer()).toEqual({
      field: { x: 100, y: 100, width: 1080, height: 520 },
      screen: { x: 100, y: 100, width: 1080, height: 520 },
      comment: { x: 100, y: 100, width: 1080, height: 520 }
    })
    expect(_default.field()).toEqual({})
    expect(_default.broadcaster()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/broadcaster.default.png' } })
    expect(_default.screen()).toEqual({})
    expect(_default.spot()).toMatchObject([{ x: 0, y: 0, ...matchSpotAssets }])
    expect(_default.commentSupplier()).toMatchObject({ interval: 1000, comments: [] })
    expect(_default.commentDeployer()).toMatchObject({ speed: 1, intervalY: 40, font: { size: 35 } })
  })
  it('デフォルト要素をカスタマイズできる', () => {
    _default
      .layer({
        field: { x: 150, y: 200, width: 1000, height: 800 },
        screen: { x: 250, y: 300, width: 1500, height: 1800 },
        comment: { x: 500, y: 1000, width: 200, height: 100 }
      })
      .field({})
      .broadcaster({ x: 300, y: 400, speed: 2, asset: scene.asset.getImageById('broadcaster.default') })
      .screen({})
      .spot({ x: 500, y: 600, ...spotAssets })
      .commentSupplier({ interval: 500, comments: [{ comment: 'hoge', conditions: [] }] })
      .commentDeployer({ speed: 2, intervalY: 10, font: new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 15 }) })
    expect(_default.layer()).toEqual({
      field: { x: 150, y: 200, width: 1000, height: 800 },
      screen: { x: 250, y: 300, width: 1500, height: 1800 },
      comment: { x: 500, y: 1000, width: 200, height: 100 }
    })
    expect(_default.field()).toEqual({})
    expect(_default.broadcaster()).toMatchObject({ x: 300, y: 400, speed: 2, asset: { path: './image/broadcaster.default.png' } })
    expect(_default.screen()).toEqual({})
    expect(_default.spot()).toMatchObject([{ x: 500, y: 600, ...matchSpotAssets }])
    expect(_default.commentSupplier()).toMatchObject({ interval: 500, comments: [{ comment: 'hoge', conditions: [] }] })
    expect(_default.commentDeployer()).toMatchObject({ speed: 2, intervalY: 10, font: { size: 15 } })
    const sb = new LiveOnAirSceneBuilder(g.game)
    expect(sb.layer()).toEqual({
      field: { x: 150, y: 200, width: 1000, height: 800 },
      screen: { x: 250, y: 300, width: 1500, height: 1800 },
      comment: { x: 500, y: 1000, width: 200, height: 100 }
    })
    expect(sb.field()).toEqual({})
    expect(sb.broadcaster()).toMatchObject({ x: 300, y: 400, speed: 2, asset: { path: './image/broadcaster.default.png' } })
    expect(sb.screen()).toEqual({})
    expect(sb.spot()).toHaveLength(0)
    expect(sb.commentSupplier()).toMatchObject({ interval: 500, comments: [{ comment: 'hoge', conditions: [] }] })
    expect(sb.commentDeployer()).toMatchObject({ speed: 2, intervalY: 10, font: { size: 15 } })
  })
  it('すべて未指定で定義した構成要素を参照できる', async () => {
    const sb = new LiveOnAirSceneBuilder(g.game)
      .layer({})
      .field({})
      .screen({})
      .broadcaster({})
      .spot({})
      .spot({})
      .commentSupplier({})
      .commentDeployer({})
    expect(sb.layer()).toEqual({
      field: { x: 100, y: 100, width: 1080, height: 520 },
      screen: { x: 100, y: 100, width: 1080, height: 520 },
      comment: { x: 100, y: 100, width: 1080, height: 520 }
    })
    expect(sb.field()).toEqual({})
    expect(sb.broadcaster()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/broadcaster.default.png' } })
    expect(sb.screen()).toEqual({})
    expect(sb.spot()).toMatchObject([{ x: 0, y: 0, ...matchSpotAssets }, { x: 0, y: 0, ...matchSpotAssets }])
    expect(sb.commentSupplier()).toMatchObject({ interval: 1000, comments: [] })
    expect(sb.commentDeployer()).toMatchObject({ speed: 1, intervalY: 40, font: { size: 35 } })
    const s = sb.build()
    g.game.pushScene(s)
    await gameContext.step()
    expect(s.layer.field).toMatchObject({ x: 100, y: 100, width: 1080, height: 520 })
    expect(s.field.area).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    expect(s.broadcaster.view).toMatchObject({ x: 0, y: 0, src: scene.asset.getImageById('broadcaster.default') })
    expect(s.screen.area).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    expect(s.spots).toHaveLength(2)
    expect(s.spots[0].location).toEqual({ x: 0, y: 0 })
    expect(s.spots[0].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    expect(s.spots[1].location).toEqual({ x: 0, y: 0 })
    expect(s.spots[1].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    expect(s.commentSupplier.interval).toBe(1000)
    expect(s.commentSupplier.comments).toMatchObject([{ comment: 'わこつ' }])
    expect(s.commentDeployer.speed).toBe(1)
    expect(s.commentDeployer.intervalY).toBe(40)
    expect(s.commentDeployer.font.size).toBe(35)
    screenshot('scene.default.png')
  })
  it('定義したカスタム構成要素（すべて指定）を参照できる', async () => {
    const sb = new LiveOnAirSceneBuilder(g.game)
      .layer({
        field: { x: 150, y: 200, width: 1000, height: 800 },
        screen: { x: 250, y: 300, width: 1200, height: 500 },
        comment: { x: 350, y: 400, width: 1400, height: 200 }
      })
      .field({})
      .broadcaster({ x: 500, y: 600, speed: 2, asset: scene.asset.getImageById('broadcaster.default') })
      .screen({})
      .spot({ x: 700, y: 400, ...spotAssets })
      .commentSupplier({ interval: 400, comments: [{ comment: 'hoge', conditions: [() => false] }] })
      .commentDeployer({ speed: 4, intervalY: 200, font: new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 150 }) })
    expect(sb.layer()).toEqual({
      field: { x: 150, y: 200, width: 1000, height: 800 },
      screen: { x: 250, y: 300, width: 1200, height: 500 },
      comment: { x: 350, y: 400, width: 1400, height: 200 }
    })
    expect(sb.field()).toEqual({})
    expect(sb.broadcaster()).toMatchObject({ x: 500, y: 600, speed: 2, asset: { path: './image/broadcaster.default.png' } })
    expect(sb.screen()).toEqual({})
    expect(sb.spot()).toMatchObject([{ x: 700, y: 400, ...matchSpotAssets }])
    expect(sb.commentSupplier()).toMatchObject({ interval: 400, comments: [{ comment: 'hoge' }] })
    expect(sb.commentDeployer()).toMatchObject({ speed: 4, intervalY: 200, font: { size: 150 } })
    const s = sb.build()
    g.game.pushScene(s)
    await gameContext.step()
    expect(s.layer.field).toMatchObject({ x: 150, y: 200, width: 1000, height: 800 })
    expect(s.layer.screen).toMatchObject({ x: 250, y: 300, width: 1200, height: 500 })
    expect(s.layer.comment).toMatchObject({ x: 350, y: 400, width: 1400, height: 200 })
    expect(s.field.area).toEqual({ x: 150, y: 200, width: 1000, height: 800 })
    expect(s.broadcaster.view).toMatchObject({ x: 500, y: 600, src: scene.asset.getImageById('broadcaster.default') })
    expect(s.screen.area).toEqual({ x: 250, y: 300, width: 1200, height: 500 })
    expect(s.spots).toHaveLength(1)
    expect(s.spots[0].location).toEqual({ x: 700, y: 400 })
    expect(s.spots[0].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    expect(s.commentSupplier.interval).toBe(400)
    expect(s.commentSupplier.comments).toMatchObject([{ comment: 'わこつ' }, { comment: 'hoge' }])
    expect(s.commentDeployer.speed).toBe(4)
    expect(s.commentDeployer.intervalY).toBe(200)
    expect(s.commentDeployer.font.size).toBe(150)
    screenshot('scene.custom.png')
  })
  it('一度定義したカスタム構成要素を更新できる', () => {
    const sb = new LiveOnAirSceneBuilder(g.game)
      .layer({
        field: { x: 150, y: 200, width: 1000, height: 800 },
        screen: { x: 250, y: 300, width: 1500, height: 1800 },
        comment: { x: 350, y: 400, width: 1400, height: 400 }
      })
      .layer({
        field: { x: 300, y: 400, width: 500, height: 400 },
        screen: { x: 50, y: 100, width: 200, height: 300 },
        comment: { x: 550, y: 800, width: 900, height: 600 }
      })
      .broadcaster({ x: 100, y: 200 })
      .broadcaster({ x: 300, y: 400 })
      .commentSupplier({ interval: 100, comments: [{ comment: 'foo', conditions: [] }, { comment: 'bar', conditions: [] }] })
      .commentSupplier({ interval: 200, comments: [{ comment: 'hoge', conditions: [] }] })
      .commentDeployer({ speed: 2, intervalY: 500, font: new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 500 }) })
      .commentDeployer({ speed: 4, intervalY: 100, font: new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 100 }) })
    expect(sb.layer()).toEqual({
      field: { x: 300, y: 400, width: 500, height: 400 },
      screen: { x: 50, y: 100, width: 200, height: 300 },
      comment: { x: 550, y: 800, width: 900, height: 600 }
    })
    expect(sb.broadcaster()).toMatchObject({ x: 300, y: 400 })
    expect(sb.commentSupplier()).toMatchObject({ interval: 200, comments: [{ comment: 'hoge' }] })
    expect(sb.commentDeployer()).toMatchObject({ speed: 4, intervalY: 100, font: { size: 100 } })
  })
  it('無効な値は設定できない', () => {
    const sb = new LiveOnAirSceneBuilder(g.game)
    expect(() => _default.broadcaster({ speed: -1 })).toThrow()
    expect(_default.broadcaster().speed).toBe(1)
    expect(() => sb.broadcaster({ speed: -1 })).toThrow()
    expect(sb.broadcaster().speed).toBe(1)
    expect(() => sb.commentSupplier({ interval: -1 })).toThrow()
    expect(sb.commentSupplier().interval).toBe(1000)
    expect(() => sb.commentDeployer({ intervalY: -1 })).toThrow()
    expect(sb.commentDeployer().intervalY).toBe(40)
    expect(() => sb.commentDeployer({ speed: -1 })).toThrow()
    expect(sb.commentDeployer().speed).toBe(1)
  })
})
