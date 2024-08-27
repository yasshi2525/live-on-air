import { AssetsParameters } from '@yasshi2525/pixi-image-packer'
import { createText } from './text'

const main = (): AssetsParameters => [
  createText({ name: 'spot.default', text: 'Spot', size: 50, strokeWidth: 10, blur: true })
]

export = main
