// テスト時はモック化されるのでカバレッジ収集対象外
// istanbul ignore next
export const image = (container: g.Game | g.Scene, path: string): g.ImageAsset =>
  (container instanceof g.Game ? container.scene()! : container).asset.getImage(require.resolve(`../../${path}`))
