import { AssetsParameters } from '@yasshi2525/pixi-image-packer'
import { createText } from './text'

const main = (): AssetsParameters => [
  createText({ name: 'default', text: 'default', size: 50, strokeWidth: 10, blur: true }),
  createText({ name: 'player.default', text: 'Player', size: 50, color: 0xaaaaff, strokeWidth: 10, blur: true }),
  createText({ name: 'spot.default', text: 'Spot', size: 50, strokeWidth: 10, blur: true }),
  createText({ name: 'layer.field.label', text: 'field', size: 25, color: 0x000000, stokeColor: 0xffffff })
]

export = main
