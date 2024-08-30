import { SingleFrameAssets } from '@yasshi2525/pixi-image-packer'
import { spotImageTypes } from '../../src/builder/spotConfig'
import { Container, Graphics } from 'pixi.js'
import { AdjustmentFilter, GlowFilter, OutlineFilter } from 'pixi-filters'
import { buildText } from './text'

interface SpotOptions {
  name: string
  label: string
  fontSize: number
  width: number
  height: number
  baseColor: number
  padding: number
}

export const createSpot = ({
  name, label, fontSize = 50, width, height, baseColor, padding = 10
}: SpotOptions): SingleFrameAssets[] => {
  return spotImageTypes.map(typ => {
    const data = new Container()
    const base = new Graphics()
    base.beginFill(baseColor)
    base.drawEllipse(width / 2, height / 2, width / 2 - padding * 2, height / 3 - padding * 2)
    base.endFill()
    base.localTransform.translate(0, height / 4)
    base.filters = []
    switch (typ) {
      case 'locked':
        base.filters.push(new AdjustmentFilter({ saturation: 0, brightness: 2 }))
        break
      case 'disabled':
        base.filters.push(new AdjustmentFilter({ saturation: 0 }))
        break
    }
    base.filters.push(new OutlineFilter(padding / 4, 0xffffff, 1))
    switch (typ) {
      case 'normal':
      case 'unvisited':
        base.filters.push(new GlowFilter({ color: baseColor, quality: 1 }))
        break
    }
    data.addChild(base)
    const spotLabel = buildText({ text: label, size: fontSize, strokeWidth: 4, blur: true })
    spotLabel.data.localTransform.translate((width - spotLabel.width) / 2, (height - spotLabel.height) / 3)
    data.addChild(spotLabel.data)
    switch (typ) {
      case 'unvisited': {
        const newLabel = buildText({ text: 'NEW!', color: 0xffd700, size: fontSize / 2, strokeWidth: 4, blur: true })
        newLabel.data.localTransform.translate(width - newLabel.width, 0)
        data.addChild(newLabel.data)
      }
        break
    }
    return {
      name: `${name}.${typ}`,
      data,
      width,
      height
    }
  })
}
