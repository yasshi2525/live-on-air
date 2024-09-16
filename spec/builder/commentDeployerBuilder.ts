import { CommentDeployerBuilder } from '../../src'

describe('commentDeployerBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = CommentDeployerBuilder.getDefault(scene)
    expect(def.speed()).toEqual(4)
    expect(def.intervalY()).toEqual(40)
    expect(def.font().size).toEqual(35)
    def
      .speed(2)
      .intervalY(100)
      .font(new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 100 }))
    expect(def.speed()).toBe(2)
    expect(def.intervalY()).toBe(100)
    expect(def.font().size).toEqual(100)
    const cdb = new CommentDeployerBuilder(scene)
    expect(cdb.speed()).toBe(2)
    expect(cdb.intervalY()).toBe(100)
    expect(cdb.font().size).toEqual(100)
  })
  it('デフォルトの設定で作成できる', () => {
    const cdb = new CommentDeployerBuilder(scene)
    expect(cdb.speed()).toEqual(4)
    expect(cdb.intervalY()).toEqual(40)
    expect(cdb.font().size).toEqual(35)
    const cd = cdb.build()
    expect(cd.speed).toBe(4)
    expect(cd.intervalY).toBe(40)
    expect(cd.font.size).toEqual(35)
  })
  it('カスタム設定で作成できる', () => {
    const cdb = new CommentDeployerBuilder(scene)
      .speed(10)
      .intervalY(10)
      .font(new g.DynamicFont({ game: g.game, fontFamily: 'sans-serif', size: 10 }))
    const cd = cdb.build()
    expect(cd.speed).toBe(10)
    expect(cd.intervalY).toBe(10)
    expect(cd.font.size).toEqual(10)
  })
  it('不正な値は指定できない', () => {
    const builder = new CommentDeployerBuilder(scene)
    expect(() => builder.speed(0)).toThrow()
    expect(() => builder.intervalY(0)).toThrow()
  })
})
