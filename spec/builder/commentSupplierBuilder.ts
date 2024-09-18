import {
  BroadcasterBuilder,
  CommentContextSupplier,
  CommentSupplierBuilder,
  FieldBuilder,
  ScreenBuilder
} from '../../src'

describe('commentSupplierBuilder', () => {
  let commentContextSupplier: CommentContextSupplier
  beforeEach(() => {
    commentContextSupplier = new CommentContextSupplier({
      broadcaster: new BroadcasterBuilder(scene).build(),
      field: new FieldBuilder(scene).build(),
      screen: new ScreenBuilder(scene).build()
    })
  })

  it('デフォルトの設定を変更できる', () => {
    const def = CommentSupplierBuilder.getDefault(scene)
    expect(def.interval()).toEqual(1000)
    expect(def.comments()).toMatchObject([{ comment: 'わこつ' }])
    def
      .interval(400)
      .addComment('hoge', () => true)
    expect(def.comments()).toMatchObject([{ comment: 'わこつ' }, { comment: 'hoge' }])
    def.comments([]) // 一括設定で前までの値を削除
    expect(def.comments()).toHaveLength(0)
    const csb = new CommentSupplierBuilder(scene)
    expect(csb.interval()).toBe(400)
    expect(csb.comments()).toHaveLength(0)
  })
  it('デフォルトの設定で作成できる', () => {
    const csb = new CommentSupplierBuilder(scene)
    expect(csb.interval()).toBe(1000)
    expect(csb.comments()).toMatchObject([{ comment: 'わこつ' }])
    const cs = csb.build()
    expect(cs.interval).toBe(1000)
    expect(cs.comments).toMatchObject([{ comment: 'わこつ' }])
  })
  it('カスタム設定で作成できる', () => {
    const csb = new CommentSupplierBuilder(scene)
      .interval(200)
      .addComment('foo')
      .comments([]) // 一括設定で前までの値を削除
      .addComment('bar')
    const cs = csb.build()
    expect(cs.interval).toBe(200)
    // デフォルト値 + 値
    expect(cs.comments).toMatchObject([{ comment: 'わこつ' }, { comment: 'bar' }])
  })
  it('不正な値は指定できない', () => {
    const builder = new CommentSupplierBuilder(scene)
    expect(() => builder.interval(-1)).toThrow()
    expect(builder.interval()).toBe(1000)
  })
  it('コメントは最低一件必要', () => {
    CommentSupplierBuilder.getDefault(scene).comments([])
    expect(() => new CommentSupplierBuilder(scene).build()).toThrow()
  })
  it('二重開始は不可', () => {
    const cs = new CommentSupplierBuilder(scene).build()
    expect(cs.status).toBe('initialized')
    cs.start(commentContextSupplier)
    expect(cs.status).toBe('scheduled')
    expect(() => cs.start(commentContextSupplier)).toThrow()
    expect(cs.status).toBe('scheduled')
  })
  it('varsにundefinedを入れられる', () => {
    const csb = new CommentSupplierBuilder(scene)
      .vars('hoge')
      .vars(undefined)
    expect(csb.vars()).not.toBeDefined()
    const cs = csb.build()
    expect(cs.vars).not.toBeDefined()
  })
})
