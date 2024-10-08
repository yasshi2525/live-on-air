import {
  BroadcasterBuilder,
  CommentContext,
  CommentContextSupplier,
  CommentSupplierBuilder,
  FieldBuilder,
  ScreenBuilder
} from '../../src'

describe('commentSupplier', () => {
  let context: CommentContext
  let oldFPS: number
  beforeEach(() => {
    context = new CommentContextSupplier({
      broadcaster: new BroadcasterBuilder(scene).build(),
      field: new FieldBuilder(scene).build(),
      screen: new ScreenBuilder(scene).build()
    }).get()
    oldFPS = g.game.fps
  })
  afterEach(() => {
    g.game.fps = oldFPS
  })
  it('条件なしコメントを登録できる', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('hoge')
      .build()
    expect(cs.comments).toMatchObject([{ comment: 'わこつ' }, { comment: 'hoge' }])
  })
  it('条件つきコメントを登録できる', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('hoge', () => Math.random() < 0.5)
      .build()
    expect(cs.comments).toMatchObject([{ comment: 'わこつ' }, { comment: 'hoge' }])
  })
  it('条件が複数あるコメントを登録できる', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('hoge', () => Math.random() < 0.5, () => Math.random() < 0.5)
      .build()
    expect(cs.comments).toMatchObject([{ comment: 'わこつ' }, { comment: 'hoge' }])
  })
  it('登録したコメントを取得できる', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('hoge')
      .build()
    let current: string[] = []
    while (current.length === 0 || current[0] === 'わこつ') {
      current = cs.fetch(context)
    }
    expect(current).toContain('hoge')
  })
  it('条件にマッチするコメントを取得できる', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('foo', () => false, () => true)
      .addComment('bar')
      .build()
    let current: string[] = []
    while (current.length === 0 || current[0] === 'わこつ') {
      current = cs.fetch(context)
    }
    expect(current).toContain('bar')
  })
  it('コメントがヒットしない場合、空のコメントを返す', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('hoge', () => false)
      .build()
    cs.interval = 1000 / 30
    expect(cs.fetch(context)).toHaveLength(0)
    expect(cs.fetch(context)).toEqual(['わこつ'])
    expect(cs.fetch(context)).toHaveLength(0)
    expect(cs.fetch(context)).toHaveLength(0)
  })
  it('コメント率を設定できる', () => {
    const cs = new CommentSupplierBuilder(scene).addComment('hoge').build()
    cs.interval = 0.1
    expect(cs.interval).toBe(0.1)
  })
  it('無効なコメント率は設定できない', () => {
    const cs = new CommentSupplierBuilder(scene).addComment('hoge').build()
    expect(() => {
      cs.interval = -1
    }).toThrow()
    expect(() => {
      cs.interval = 0
    }).toThrow()
  })
  it('コメントが順番に提供される', () => {
    const cs = new CommentSupplierBuilder(scene)
      .addComment('1')
      .addComment('2')
      .build()
    cs.interval = 1000 / 30
    expect(cs.fetch(context)).toHaveLength(0)
    expect(cs.fetch(context)).toEqual(['わこつ'])
    expect(cs.fetch(context)).toEqual(['1'])
    expect(cs.fetch(context)).toEqual(['2'])
  })
  it('自由に値を追加・参照できる', () => {
    const cs = new CommentSupplierBuilder(scene).build()
    expect(cs.vars).not.toBeDefined()
    cs.vars = 'Hello'
    expect(cs.vars).toBe('Hello')
  })
})
