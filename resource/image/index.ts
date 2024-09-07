import { AssetsParameters } from '@yasshi2525/pixi-image-packer'
import { createText } from './text'
import { createSpot } from './spot'

const main = (): AssetsParameters => [
  createText({ name: 'default', text: 'default', size: 50, strokeWidth: 10, blur: true }),
  createText({ name: 'broadcaster.default', text: 'Broadcaster', size: 50, color: 0xaaaaff, strokeWidth: 10, blur: true }),
  createText({ name: 'spot.default', text: 'Spot', size: 50, strokeWidth: 10, blur: true }),
  ...createSpot({ name: 'spot.default', label: 'Spot', fontSize: 40, width: 150, height: 100, baseColor: 0x4169e1, padding: 10 }),
  createText({ name: 'layer.field.label', text: 'field', size: 25, color: 0x000000, stokeColor: 0xffffff }),
  createText({ name: 'layer.screen.label', text: 'screen', size: 25, color: 0x000000, stokeColor: 0xffffff })
]

export = main
