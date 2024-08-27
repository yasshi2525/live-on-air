import { Configure } from '../../src/util/configure'

describe('Configure', () => {
  it('デフォルトのデフォルト値は必須', () => {
    expect(() => new Configure(null)).toThrow()
  })
  it('値がある場合、その値が取得される', () => {
    const config = new Configure('none', { foo: 'bar' }, { foo: 'override' })
    expect(config.get('foo')).toEqual('override')
  })
  it('値がない場合、デフォルト値が取得される', () => {
    const config = new Configure('none', { foo: 'bar' }, {})
    expect(config.getDefault('foo')).toEqual('bar')
    expect(config.get('foo')).toEqual('bar')
  })
  it('デフォルト値もない場合、デフォルトのデフォルト値が取得される', () => {
    const config = new Configure('none')
    expect(config.getDefault('hoge')).toEqual('none')
    expect(config.get('hoge')).toEqual('none')
  })
  it('値を設定すると、デフォルト値を返さなくなる', () => {
    const config = new Configure('none', { foo: 'bar' })
    expect(config.get('foo')).toEqual('bar')
    config.put('foo', 'override')
    expect(config.getDefault('foo')).toEqual('bar')
    expect(config.get('foo')).toEqual('override')
  })
  it('まとめて値が設定できる。変更がない値はそのまま', () => {
    const config = new Configure<string, string>('none', {}, { foo: 'bar' })
    expect(config.get('foo')).toEqual('bar')
    config.putAll({ hogeK: 'hogeV' })
    expect(config.get('hogeK')).toEqual('hogeV')
    expect(config.get('foo')).toEqual('bar')
  })
  it('デフォルト値を設定すると、デフォルトのデフォルト値を返さなくなる', () => {
    const config = new Configure('none')
    expect(config.get('foo')).toEqual('none')
    config.putDefault('foo', 'hoge')
    expect(config.getDefault('foo')).toEqual('hoge')
    expect(config.get('foo')).toEqual('hoge')
  })
  it('まとめてデフォルト値が設定できる。変更がない値はそのまま', () => {
    const config = new Configure<string, string>('none', { foo: 'bar' })
    expect(config.getDefault('foo')).toEqual('bar')
    config.putAllDefault({ hogeK: 'hogeV' })
    expect(config.getDefault('hogeK')).toEqual('hogeV')
    expect(config.getDefault('foo')).toEqual('bar')
  })
  it('設定する値は必須', () => {
    const config = new Configure<string, string | null>('none')
    expect(() => config.put('foo', null)).toThrow()
  })
  it('設定するデフォルト値は必須', () => {
    const config = new Configure<string, string | null>('none')
    expect(() => config.putDefault('foo', null)).toThrow()
  })
  it('デフォルトのデフォルト値は必須', () => {
    const config = new Configure<string, string | null>('none')
    expect(() => {
      config.default = null
    }).toThrow()
  })
  it('設定した値を消去するとデフォルト値を返す', () => {
    const config = new Configure('none', { foo: 'bar' }, { foo: 'override' })
    expect(config.get('foo')).toEqual('override')
    config.clear()
    expect(config.getDefault('foo')).toEqual('bar')
    expect(config.get('foo')).toEqual('bar')
  })
  it('デフォルトのデフォルト値を変更できる', () => {
    const config = new Configure('none')
    expect(config.default).toEqual('none')
    config.default = 'override'
    expect(config.default).toEqual('override')
    expect(config.getDefault('foo')).toEqual('override')
    expect(config.get('foo')).toEqual('override')
  })
  it('自身が予め定義したデフォルト値・値がエントリに含まれる', () => {
    const config = new Configure('none', { foo: 'bar' }, { hogeK: 'hogeV' })
    expect(config.keys()).toEqual(['foo', 'hogeK'])
    expect(config.entries()).toEqual({ foo: 'bar', hogeK: 'hogeV' })
  })
  it('自身で後から定義したデフォルト値・値がエントリに含まれる', () => {
    const config = new Configure('none')
    config.putDefault('foo', 'bar')
    config.put('hogeK', 'hogeV')
    expect(config.keys()).toEqual(['foo', 'hogeK'])
    expect(config.entries()).toEqual({ foo: 'bar', hogeK: 'hogeV' })
  })
  it('エントリはデフォルト値よりも値が優先される', () => {
    const config = new Configure('none')
    config.putDefault('foo', 'bar')
    config.put('foo', 'override')
    config.put('hogeK', 'hogeV')
    expect(config.keys()).toEqual(['foo', 'hogeK'])
    expect(config.entries()).toEqual({ foo: 'override', hogeK: 'hogeV' })
  })
})
