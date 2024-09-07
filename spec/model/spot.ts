import { BroadcasterBuilder, Field, Broadcaster, SpotBuilder, FieldBuilder, Screen, ScreenBuilder } from '../../src'
import { waitFor } from '../__helper'

describe('Spot', () => {
  let sb: SpotBuilder
  let field1: Field
  let field2: Field
  let broadcaster: Broadcaster
  let screen: Screen

  beforeEach(() => {
    sb = new SpotBuilder(scene)
    field1 = new FieldBuilder().build()
    field1.container = new g.FilledRect({ scene, parent: scene, x: 20, y: 20, width: 700, height: 500, cssColor: '#ffaaaa' })
    field2 = new FieldBuilder().build()
    broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field1)
    screen = new ScreenBuilder(scene).build()
  })

  it('Spotを配置できる', async () => {
    const spot = sb.build()
    expect(spot.field).not.toBeDefined()
    expect(spot.location).not.toBeDefined()
    expect(spot.status).toBe('non-deployed')
    spot.deployOn(field1)
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
    expect(spot.location).toBeDefined()
    expect(spot.status).toBe('enabled')
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.unvisited.png')
    await gameContext.step()
    screenshot('spot.deploy.png')
  })

  it('同じFieldへの二重登録時は何もしない', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.deployOn(field1)
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
  })

  it('他のFieldには配置できない', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    expect(() => spot.deployOn(field2)).toThrow()
    expect(spot.field).toBe(field1)
    expect(field1.spots).toContain(spot)
    expect(field2.spots).not.toContain(spot)
  })

  it('訪問不可能にする', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.disable()
    expect(spot.status).toBe('disabled')
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.disabled.png')
    await gameContext.step()
    screenshot('spot.disabled.png')
  })

  it('訪問可能にする', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.enable()
    expect(spot.status).toBe('enabled')
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.unvisited.png')
    await gameContext.step()
    screenshot('spot.enabled.png')
  })

  it('訪問可能にする(訪問済み状態)', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.attach(screen)
    broadcaster.jumpTo(spot)
    spot.enable()
    expect(spot.status).toBe('enabled')
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.normal.png')
    await gameContext.step()
    screenshot('spot.enabled.visited.png')
  })

  it('broadcasterを訪問させる', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.attach(screen)
    spot.setAsDestination()
    expect(spot.status).toBe('target')
    expect(broadcaster.destination).toBe(spot)
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.unvisited.png')
    await gameContext.step()
    screenshot('spot.target.png')
  })

  it('broadcasterの訪問をキャンセルさせる', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.attach(screen)
    spot.setAsDestination()
    spot.unsetAsDestination()
    expect(spot.status).toBe('enabled')
    expect(broadcaster.destination).not.toBeDefined()
    expect(spot.view).toBeInstanceOf(g.Sprite)
    expect(((spot.view as g.Sprite).src as g.ImageAsset).path).toBe('./image/spot.default.unvisited.png')
    await gameContext.step()
    screenshot('spot.cancel.png')
  })

  it('fieldに配置されていないと移動対象として設定されない', () => {
    const spot = sb.build()
    expect(() => spot.setAsDestination()).toThrow()
    expect(() => spot.unsetAsDestination()).toThrow()
    expect(() => spot.enable()).toThrow()
    expect(() => spot.disable()).toThrow()
    expect(() => spot.markAsVisited()).toThrow()
  })

  it('broadcasterがいない場合、移動対象として設定できない', () => {
    const freeField = new FieldBuilder().build()
    const spot = sb.build()
    spot.deployOn(freeField)
    expect(() => spot.setAsDestination()).toThrow()
    expect(() => spot.unsetAsDestination()).toThrow()
    expect(() => spot.markAsVisited()).toThrow()
  })

  it('broadcasterが到達すると放送中状態に遷移する', async () => {
    const spot = sb.location({ x: 100, y: 100 }).build()
    spot.deployOn(field1)
    spot.attach(screen)
    broadcaster.departTo(spot)
    expect(spot.visited).toBeFalsy()
    expect(spot.status).toBe('target')
    expect(broadcaster.status).toBe('moving')
    await waitFor(broadcaster.onEnter)
    expect(spot.visited).toBeTruthy()
    expect(spot.status).toBe('enabled')
    expect(broadcaster.status).toBe('on-air')
    await gameContext.step()
    screenshot('spot.visited.png')
  })

  it('broadcasterがゼロ距離移動で到達すると次stepで放送中状態に遷移する', async () => {
    const spot = sb.build()
    spot.deployOn(field1)
    spot.attach(screen)
    expect(broadcaster.location).toEqual(spot.location)
    expect(spot.visited).toBeFalsy()
    broadcaster.departTo(spot)
    expect(spot.visited).toBeFalsy()
    expect(spot.status).toBe('target')
    expect(broadcaster.status).toBe('moving')
    await gameContext.step()
    expect(spot.visited).toBeTruthy()
    expect(spot.status).toBe('enabled')
    expect(broadcaster.status).toBe('on-air')
    await gameContext.step()
    screenshot('spot.visited.zero-distance-moving.png')
  })

  it('broadcasterがjumpすると同一stepで放送中状態に遷移する', async () => {
    const spot = sb.location({ x: 100, y: 100 }).build()
    spot.deployOn(field1)
    spot.attach(screen)
    expect(spot.visited).toBeFalsy()
    broadcaster.jumpTo(spot)
    expect(spot.visited).toBeTruthy()
    expect(spot.status).toBe('enabled')
    expect(broadcaster.status).toBe('on-air')
    await gameContext.step()
    screenshot('spot.visited.jump.png')
  })

  it('broadcasterが到着する前は、訪問済みマークに失敗する', () => {
    const spot = sb.location({ x: 100, y: 100 }).build()
    spot.deployOn(field1)
    spot.attach(screen)
    broadcaster.departTo(spot)
    expect(broadcaster.location).not.toEqual(spot.location)
    expect(spot.visited).toBeFalsy()
    expect(() => spot.markAsVisited()).toThrow()
    expect(broadcaster.location).not.toEqual(spot.location)
    expect(spot.visited).toBeFalsy()
    expect(spot.status).toBe('target')
    expect(broadcaster.status).toBe('moving')
  })

  it('broadcasterが停止状態のとき、訪問済みマークに失敗する', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    expect(broadcaster.status).toBe('stopping-on-ground')
    expect(spot.visited).toBeFalsy()
    expect(broadcaster.destination).not.toBeDefined()
    expect(() => spot.markAsVisited()).toThrow()
    expect(broadcaster.status).toBe('stopping-on-ground')
    expect(spot.visited).toBeFalsy()
    expect(spot.status).toBe('enabled')
  })

  it('broadcasterが他のspotを目指しているとき、訪問済みマークに失敗する', () => {
    const spot = sb.build()
    spot.deployOn(field1)
    const destination = sb.build()
    field1.addSpot(destination)
    destination.attach(screen)
    broadcaster.departTo(destination)
    expect(spot.visited).toBeFalsy()
    expect(() => spot.markAsVisited()).toThrow()
    expect(spot.visited).toBeFalsy()
  })

  it('自由に値を追加・参照できる', () => {
    const spot = sb.build()
    expect(spot.vars).not.toBeDefined()
    spot.vars = 'Hello'
    expect(spot.vars).toBe('Hello')
  })
})
