// テスト時はモック化されるのでカバレッジ収集対象外
// istanbul ignore next
export const image = (scene: g.Scene, path: string): g.ImageAsset =>
  scene.asset.getImage(require.resolve(`../../${path}`))
