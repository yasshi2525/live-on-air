import { Layer, LayerBuilder, Ticker, TickerBuilder } from '../../src'
import { waitFor } from '../__helper'

describe('ticker', () => {
  let layer: Layer
  let ticker: Ticker

  beforeEach(() => {
    layer = new LayerBuilder(scene).build()
    ticker = new TickerBuilder(scene).build()
  })

  it('開始するまでは表示変更なし', () => {
    expect(ticker.status).toBe('disabled')
    expect(ticker.value).toBe(60)
    expect(ticker.rawValue).toBe(1800)
    ticker.set(50)
    ticker.add(-1)
    expect(ticker.value).toBe(60)
    expect(ticker.rawValue).toBe(1800)
  })

  it('終了後は表示変更なし', async () => {
    ticker.enable()
    expect(ticker.status).toBe('enabled')
    await waitFor(ticker.onExpire)
    expect(ticker.status).toBe('disabled')
    expect(ticker.rawValue).toBe(0)
    expect(ticker.value).toBe(0)
    ticker.set(50)
    ticker.add(-1)
    expect(ticker.rawValue).toBe(0)
    expect(ticker.value).toBe(0)
  })

  it('描画される', async () => {
    ticker.container = layer.header
    expect(ticker.container).toBe(layer.header)
    expect((layer.header.children![0] as g.Label).text).toEqual('残り60秒')
    await gameContext.step()
    screenshot('ticker.view.png')
  })

  it('containerをなくすと描画されない', () => {
    ticker.container = layer.header
    const label = layer.header.children![0]
    ticker.container = undefined
    expect(ticker.container).not.toBeDefined()
    expect(label.parent).not.toBeDefined()
  })
})
