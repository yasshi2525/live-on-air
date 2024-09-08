import { Live, LiveContext } from '../src'

export const waitFor = async <T>(trigger: g.Trigger<T>): Promise<T> =>
  new Promise<T>(resolve => {
    let result:
      { complete: false, value: undefined }
      | { complete: true, value: T } =
      { complete: false, value: undefined }
    trigger.addOnce((value: T) => {
      result = { complete: true, value }
    })
    const next = (): void => {
      if (result.complete) {
        resolve(result.value)
        return
      }
      gameContext.step().then(() => next())
    }
    next()
  })

export class SimpleLive implements Live {
  start (_: LiveContext, end: () => void) {
    end()
  }
}
