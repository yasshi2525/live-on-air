import { FieldBuilder } from '../../src'

describe('FieldBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = FieldBuilder.getDefault(scene)
    expect(def.vars()).not.toBeDefined()
    def.vars('hoge')
    expect(def.vars()).toBe('hoge')
    const field = new FieldBuilder(scene).build()
    expect(field.vars).toBe('hoge')
  })
  it('filed を 作成できる', () => {
    const field = new FieldBuilder(scene).build()
    expect(field).toBeDefined()
  })
  it('varsにundefinedを入れられる', () => {
    const fb = new FieldBuilder(scene)
      .vars('hoge')
      .vars(undefined)
    expect(fb.vars()).not.toBeDefined()
    const field = fb.build()
    expect(field.vars).not.toBeDefined()
  })
})
