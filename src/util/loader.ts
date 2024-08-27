export const image = (scene: g.Scene, path: string): g.ImageAsset =>
  scene.asset.getImage(require.resolve(`../../${path}`))
