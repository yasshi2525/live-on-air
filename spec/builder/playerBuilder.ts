import { PlayerBuilder } from '../../src'

describe('playerBuilder', () => {
  it('デフォルトの設定で作成できる', () => {
    const pb = new PlayerBuilder()
    const player = pb.build()
    expect(player.speed).toBe(1)
  })

  it('カスタム設定で作成できる', () => {
    const pb = new PlayerBuilder()
    pb.speed = 2
    const player = pb.build()
    expect(player.speed).toBe(2)
  })

  it('不正な値は設定できない', () => {
    const pb = new PlayerBuilder()
    expect(() => {
      pb.speed = -1
    }).toThrow()
    expect(pb.speed).toBe(1)
  })
})
