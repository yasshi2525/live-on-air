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
})
