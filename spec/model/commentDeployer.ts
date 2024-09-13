import {
  Broadcaster,
  BroadcasterBuilder,
  CommentContextSupplier,
  CommentDeployerBuilder,
  CommentSupplier,
  CommentSupplierBuilder,
  Field,
  FieldBuilder,
  Layer,
  LayerBuilder,
  Screen,
  ScreenBuilder
} from '../../src'
import { waitFor } from '../__helper'

describe('commentDeployer', () => {
  let broadcaster: Broadcaster
  let field: Field
  let screen: Screen
  let cs: CommentSupplier
  let layer: Layer
  let contextSupplier: CommentContextSupplier

  beforeEach(() => {
    broadcaster = new BroadcasterBuilder(scene).build()
    field = new FieldBuilder().build()
    screen = new ScreenBuilder(scene).build()
    cs = new CommentSupplierBuilder(scene)
      .add('hoge')
      .build()
    layer = new LayerBuilder(scene).build()
    contextSupplier = new CommentContextSupplier({ broadcaster, field, screen })
    cs.start(contextSupplier)
  })

  it('最初のコメントは最上段に登場する', async () => {
    const cd = new CommentDeployerBuilder(scene).build()
    cd.subscribe(cs)
    cd.container = layer.comment
    const comment = await waitFor(cd.onDeploy)
    expect(layer.comment.children).toHaveLength(1)
    expect(comment.y).toBe(0)
    await gameContext.step()
    screenshot('comment.first.png')
  })
  it('空白なら前よりも同じか上の行に登場する', async () => {
    const cd = new CommentDeployerBuilder(scene).build()
    cd.subscribe(cs)
    cd.container = layer.comment
    cs.interval = 10000
    await waitFor(cd.onDeploy)
    const next = await waitFor(cd.onDeploy)
    expect(next.y).toBe(0)
    screenshot('comment.same.row.png')
  })
  it('空白じゃないなら前よりも一つ下の行に登場する', async () => {
    const cd = new CommentDeployerBuilder(scene).build()
    cd.subscribe(cs)
    cd.container = layer.comment
    cs.interval = Math.ceil(1000 / g.game.fps)
    await waitFor(cd.onDeploy)
    const next = await waitFor(cd.onDeploy)
    expect(next.y).toBe(cd.intervalY)
    screenshot('comment.2.row.png')
  })
  it('一番下の段まで埋まっていたら前よりも一つ下の行(一周あり)に登場する', async () => {
    const cd = new CommentDeployerBuilder(scene).build()
    cd.subscribe(cs)
    cd.container = layer.comment
    cs.interval = Math.ceil(1000 / g.game.fps) / Math.ceil(layer.comment.height / cd.intervalY)
    const comment = await waitFor(cd.onDeploy)
    expect(comment.y).toBe(0)
    const next = await waitFor(cd.onDeploy)
    expect(next.y).toBe(0)
    screenshot('comment.follow.row.png')
  })
})
