import { ScorerBuilder } from '../../src'

describe('scorerBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = ScorerBuilder.getDefault(scene)
    expect(def.font()).toMatchObject({ size: 40 })
    expect(def.digit()).toBe(4)
    expect(def.prefix()).toEqual('スコア')
    expect(def.suffix()).toEqual('点')
    expect(def.refrainsSendingScore()).toBe(false)
    def
      .font(new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 50 }))
      .digit(5)
      .prefix('SCORE')
      .suffix('pt')
      .refrainsSendingScore(true)
    expect(def.font()).toMatchObject({ size: 50 })
    expect(def.digit()).toBe(5)
    expect(def.prefix()).toEqual('SCORE')
    expect(def.suffix()).toEqual('pt')
    expect(def.refrainsSendingScore()).toBe(true)
  })
  it('デフォルトの設定で作成できる', () => {
    const sb = new ScorerBuilder(scene)
    expect(sb.font()).toMatchObject({ size: 40 })
    expect(sb.digit()).toBe(4)
    expect(sb.prefix()).toEqual('スコア')
    expect(sb.suffix()).toEqual('点')
    expect(sb.refrainsSendingScore()).toBe(false)
    const scorer = sb.build()
    expect(scorer.font).toMatchObject({ size: 40 })
    expect(scorer.digit).toBe(4)
    expect(scorer.prefix).toEqual('スコア')
    expect(scorer.suffix).toEqual('点')
    expect(scorer.refrainsSendingScore).toBe(false)
  })
  it('カスタム設定で作成できる', () => {
    const sb = new ScorerBuilder(scene)
      .font(new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 50 }))
      .digit(5)
      .prefix('SCORE')
      .suffix('pt')
      .refrainsSendingScore(true)
    expect(sb.font()).toMatchObject({ size: 50 })
    expect(sb.digit()).toBe(5)
    expect(sb.prefix()).toEqual('SCORE')
    expect(sb.suffix()).toEqual('pt')
    expect(sb.refrainsSendingScore()).toBe(true)
    const scorer = sb.build()
    expect(scorer.font).toMatchObject({ size: 50 })
    expect(scorer.digit).toBe(5)
    expect(scorer.prefix).toEqual('SCORE')
    expect(scorer.suffix).toEqual('pt')
    expect(scorer.refrainsSendingScore).toBe(true)
  })
  it('無効な値は設定できない', () => {
    const sb = new ScorerBuilder(scene)
    expect(() => sb.digit(-1)).toThrow()
  })
  it('varsにundefinedを入れられる', () => {
    const sb = new ScorerBuilder(scene)
      .vars('hoge')
      .vars(undefined)
    expect(sb.vars()).not.toBeDefined()
    const scorer = sb.build()
    expect(scorer.vars).not.toBeDefined()
  })
})
