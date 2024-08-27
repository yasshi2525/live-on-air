import { GameConfiguration } from '@akashic/akashic-engine'
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'

const gameJSON: GameConfiguration = {
  width: 1280,
  height: 720,
  main: './main.js',
  assets: {},
  environment: {
    'sandbox-runtime': '3'
  }
}

const setup = (): void => {
  fs.writeFileSync('game.json', JSON.stringify(gameJSON))
  execSync('akashic scan asset image')
}

export default setup
