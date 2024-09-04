// テスト時はモック化されるのでカバレッジ収集対象外
// istanbul ignore next
export const image = (container: g.Game | g.Scene, path: string): g.ImageAsset =>
  (container instanceof g.Game ? container.scene()! : container).asset.getImage(`/node_modules/@yasshi2525/live-on-air/${path}`)
