import { Container, Text } from 'pixi.js'
import { GlowFilter } from 'pixi-filters'
import { SingleFrameAssets } from '@yasshi2525/pixi-image-packer'

interface TextOptions {
  text: string,
  size: number,
  color?: number,
  stokeColor?: number,
  strokeWidth?: number,
  padding?: number,
  blur?: boolean,
}

export const buildText = ({
  text, size, color = 0xffffff, stokeColor = 0x000000,
  strokeWidth = 0, padding = 0, blur = false
}: TextOptions): { data: Container, width: number, height: number } => {
  const data = new Container()
  const t = new Text(text, { fontSize: size, fill: color, stroke: stokeColor, strokeThickness: strokeWidth })
  if (blur) {
    t.filters = [new GlowFilter({ color, quality: 1 })]
  }
  t.localTransform.translate(padding + strokeWidth, padding + strokeWidth)
  data.addChild(t)
  return { data, width: t.width + (padding + strokeWidth) * 2, height: t.height + (padding + strokeWidth) * 2 }
}

export const createText = ({
  name, text, size, color = 0xffffff, stokeColor = 0x000000,
  strokeWidth = 2, padding = 0, blur = false
}: TextOptions & { name: string }): SingleFrameAssets => {
  return { name, ...buildText({ text, size, color, stokeColor, strokeWidth, padding, blur }) }
}
