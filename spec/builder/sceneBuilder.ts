import { SpotImageConfig, SpotImageTypes, SceneBuilder, SceneConfigure } from '../../src'
import { SceneImpl } from '../../src/model/scene'

describe('sceneBuilder', () => {
  let _default: SceneConfigure
  let spotAssets: SpotImageConfig
  let matchSpotAssets: Record<SpotImageTypes, { path: string }>

  beforeEach(() => {
    _default = SceneBuilder.getDefault(g.game)
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
    SceneBuilder.resetDefault()
    if (g.game.scene() instanceof SceneImpl) {
      g.game.popScene()
      await gameContext.step()
    }
  })
  it('デフォルトのデフォルト値は自動で付与される', () => {
    _default
      .layer({})
      .field({})
      .player({})
      .spot({})
    expect(_default.layer()).toEqual({ field: { x: 100, y: 100, width: 1080, height: 520 } })
    expect(_default.field()).toEqual({})
    expect(_default.player()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/player.default.png' } })
    expect(_default.spot()).toHaveLength(1)
    expect(_default.spot()[0]).toMatchObject({ x: 0, y: 0, ...matchSpotAssets })
  })
  it('デフォルト要素が自動で定義される', () => {
    expect(_default.layer()).toEqual({ field: { x: 100, y: 100, width: 1080, height: 520 } })
    expect(_default.field()).toEqual({})
    expect(_default.player()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/player.default.png' } })
    expect(_default.spot()).toEqual([])
  })
  it('デフォルト要素をカスタマイズできる', () => {
    _default
      .layer({ field: { x: 150, y: 200, width: 1000, height: 800 } })
      .field({})
      .player({ x: 300, y: 400, speed: 2, asset: scene.asset.getImageById('player.default') })
      .spot({ x: 500, y: 600, ...spotAssets })
    expect(_default.layer()).toEqual({ field: { x: 150, y: 200, width: 1000, height: 800 } })
    expect(_default.field()).toEqual({})
    expect(_default.player()).toMatchObject({ x: 300, y: 400, speed: 2, asset: { path: './image/player.default.png' } })
    expect(_default.spot()).toMatchObject([{ x: 500, y: 600, ...matchSpotAssets }])
    const sb = new SceneBuilder(g.game)
    expect(sb.layer()).toEqual({ field: { x: 150, y: 200, width: 1000, height: 800 } })
    expect(sb.field()).toEqual({})
    expect(sb.player()).toMatchObject({ x: 300, y: 400, speed: 2, asset: { path: './image/player.default.png' } })
    expect(sb.spot()).toHaveLength(0)
  })
  it('すべて未指定で定義した構成要素を参照できる', async () => {
    const sb = new SceneBuilder(g.game)
      .layer({})
      .field({})
      .player({})
      .spot({})
      .spot({})
    expect(sb.layer()).toEqual({ field: { x: 100, y: 100, width: 1080, height: 520 } })
    expect(sb.field()).toEqual({})
    expect(sb.player()).toMatchObject({ x: 0, y: 0, speed: 1, asset: { path: './image/player.default.png' } })
    expect(sb.spot()).toMatchObject([{ x: 0, y: 0, ...matchSpotAssets }, { x: 0, y: 0, ...matchSpotAssets }])
    const s = sb.build()
    g.game.pushScene(s)
    await gameContext.step()
    expect(s.layer.field).toMatchObject({ x: 100, y: 100, width: 1080, height: 520 })
    expect(s.field.area).toEqual({ x: 100, y: 100, width: 1080, height: 520 })
    expect(s.player.view).toMatchObject({ x: 0, y: 0, src: scene.asset.getImageById('player.default') })
    expect(s.spots).toHaveLength(2)
    expect(s.spots[0].location).toEqual({ x: 0, y: 0 })
    expect(s.spots[0].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    expect(s.spots[1].location).toEqual({ x: 0, y: 0 })
    expect(s.spots[1].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    screenshot('scene.default.png')
  })
  it('定義したカスタム構成要素（すべて指定）を参照できる', async () => {
    const sb = new SceneBuilder(g.game)
      .layer({ field: { x: 150, y: 200, width: 1000, height: 800 } })
      .field({})
      .player({ x: 500, y: 600, speed: 2, asset: scene.asset.getImageById('player.default') })
      .spot({ x: 700, y: 400, ...spotAssets })
    expect(sb.layer()).toEqual({ field: { x: 150, y: 200, width: 1000, height: 800 } })
    expect(sb.field()).toEqual({})
    expect(sb.player()).toMatchObject({ x: 500, y: 600, speed: 2, asset: { path: './image/player.default.png' } })
    expect(sb.spot()).toMatchObject([{ x: 700, y: 400, ...matchSpotAssets }])
    const s = sb.build()
    g.game.pushScene(s)
    await gameContext.step()
    expect(s.layer.field).toMatchObject({ x: 150, y: 200, width: 1000, height: 800 })
    expect(s.field.area).toEqual({ x: 150, y: 200, width: 1000, height: 800 })
    expect(s.player.view).toMatchObject({ x: 500, y: 600, src: scene.asset.getImageById('player.default') })
    expect(s.spots).toHaveLength(1)
    expect(s.spots[0].location).toEqual({ x: 700, y: 400 })
    expect(s.spots[0].view).toMatchObject({ src: { path: './image/spot.default.unvisited.png' } })
    screenshot('scene.custom.png')
  })
  it('一度定義したカスタム構成要素を更新できる', () => {
    const sb = new SceneBuilder(g.game)
      .layer({ field: { x: 150, y: 200, width: 1000, height: 800 } })
      .layer({ field: { x: 300, y: 400, width: 500, height: 400 } })
      .player({ x: 100, y: 200 })
      .player({ x: 300, y: 400 })
    expect(sb.layer()).toEqual({ field: { x: 300, y: 400, width: 500, height: 400 } })
    expect(sb.player()).toMatchObject({ x: 300, y: 400 })
  })
  it('無効な値は設定できない', () => {
    const sb = new SceneBuilder(g.game)
    expect(() => _default.player({ speed: -1 })).toThrow()
    expect(_default.player().speed).toBe(1)
    expect(() => sb.player({ speed: -1 })).toThrow()
    expect(sb.player().speed).toBe(1)
  })
})
