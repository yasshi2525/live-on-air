import { ScreenBuilder } from '../../src'

describe('ScreenBuilder', () => {
  it('デフォルトの設定を変更できる', () => {
    const def = ScreenBuilder.getDefault(scene)
    expect(def.vars()).not.toBeDefined()
    def.vars('hoge')
    expect(def.vars()).toBe('hoge')
    const screen = new ScreenBuilder(scene).build()
    expect(screen.vars).toBe('hoge')
  })
  it('filed を 作成できる', () => {
    const screen = new ScreenBuilder(scene).build()
    expect(screen).toBeDefined()
  })
  it('varsにundefinedを入れられる', () => {
    const sb = new ScreenBuilder(scene)
      .vars('hoge')
      .vars(undefined)
    expect(sb.vars()).not.toBeDefined()
    const screen = sb.build()
    expect(screen.vars).not.toBeDefined()
  })
})
