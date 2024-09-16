import { Layer, LayerBuilder, Scorer, ScorerBuilder } from '../../src'

describe('scorer', () => {
  let layer: Layer
  let scorer: Scorer

  beforeEach(() => {
    g.game.vars = { gameState: { score: 0 } }
    scorer = new ScorerBuilder(scene).build()
    layer = new LayerBuilder(scene).build()
  })

  it('開始するまでは加点無視', () => {
    expect(scorer.status).toBe('disabled')
    scorer.add(1)
    scorer.set(2)
    expect(scorer.value).toBe(0)
    expect(g.game.vars.gameState.score).toBe(0)
  })

  it('終了後は加点無視', () => {
    scorer.disable()
    expect(scorer.status).toBe('disabled')
    scorer.add(1)
    scorer.set(2)
    expect(scorer.value).toBe(0)
    expect(g.game.vars.gameState.score).toBe(0)
  })

  it('加点するとスコアも連動する', () => {
    scorer.enable()
    expect(scorer.status).toBe('enabled')
    scorer.set(2)
    scorer.add(1)
    expect(scorer.value).toBe(3)
    expect(g.game.vars.gameState.score).toBe(3)
  })

  it('0点以下は0と表示する', () => {
    scorer.enable()
    scorer.add(-1)
    expect(scorer.value).toBe(0)
    expect(g.game.vars.gameState.score).toBe(0)
    expect(scorer.rawValue).toBe(-1)
  })

  it('内部的には小数点管理', () => {
    scorer.enable()
    scorer.add(0.4)
    scorer.add(0.4)
    expect(scorer.value).toBe(0)
    expect(g.game.vars.gameState.score).toBe(0)
    expect(scorer.rawValue).toBe(0.8)
    scorer.add(0.4)
    expect(scorer.value).toBe(1)
    expect(g.game.vars.gameState.score).toBe(1)
    expect(scorer.rawValue).toBeCloseTo(1.2)
  })

  it('描画される', async () => {
    scorer.container = layer.header
    expect(scorer.container).toBe(layer.header)
    expect((layer.header.children![0] as g.Label).text).toEqual('スコア   0点')
    await gameContext.step()
    screenshot('scorer.view.png')
  })

  it('containerをなくすと描画されない', () => {
    scorer.container = layer.header
    const label = layer.header.children![0]
    scorer.container = undefined
    expect(scorer.container).not.toBeDefined()
    expect(label.parent).not.toBeDefined()
  })

  it('game.vars の形態によらず加点される', () => {
    g.game.vars = undefined
    scorer = new ScorerBuilder(scene).build()
    expect(g.game.vars.gameState.score).toBe(0)
    g.game.vars = {}
    scorer = new ScorerBuilder(scene).build()
    expect(g.game.vars.gameState.score).toBe(0)
    g.game.vars = { gameState: {} }
    scorer = new ScorerBuilder(scene).build()
    expect(g.game.vars.gameState.score).toBe(0)
  })
})
