import * as fs from 'node:fs'

const teardown = (): void => {
  if (fs.existsSync('game.json')) {
    fs.rmSync('game.json')
  }
}

export default teardown
