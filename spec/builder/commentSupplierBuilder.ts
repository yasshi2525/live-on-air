import { CommentSupplierBuilder } from '../../src'

describe('commentSupplierBuilder', () => {
  it('不正な値は指定できない', () => {
    const builder = new CommentSupplierBuilder(g.game)
    expect(() => builder.interval(-1)).toThrow()
    builder.interval(500)
    expect(builder.interval()).toBe(500)
  })
})
