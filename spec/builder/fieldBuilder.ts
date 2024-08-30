import { FieldBuilder } from '../../src'

describe('FieldBuilder', () => {
  it('filed を 作成できる', () => {
    const field = new FieldBuilder().build()
    expect(field).toBeDefined()
  })
})
