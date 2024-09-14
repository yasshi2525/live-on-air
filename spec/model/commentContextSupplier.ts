import { Broadcaster, BroadcasterBuilder, CommentContextSupplier, Field, FieldBuilder, Screen, ScreenBuilder } from '../../src'

describe('commentContextSupplier', () => {
  let broadcaster: Broadcaster
  let field: Field
  let screen: Screen

  beforeEach(() => {
    broadcaster = new BroadcasterBuilder(scene).build()
    field = new FieldBuilder().build()
    screen = new ScreenBuilder(scene).build()
  })

  it('自由に値を追加・参照できる', () => {
    const ccs = new CommentContextSupplier({ broadcaster, field, screen })
    expect(ccs.vars).not.toBeDefined()
    ccs.vars = 'Hello'
    expect(ccs.vars).toBe('Hello')
    const cc = ccs.get()
    expect(cc.vars).not.toBeDefined()
    cc.vars = 'Hello'
    expect(cc.vars).toBe('Hello')
  })
})
