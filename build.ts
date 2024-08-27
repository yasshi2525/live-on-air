import { execSync } from 'child_process'
import * as fs from 'node:fs'

if (fs.existsSync('lib')) {
  fs.rmSync('lib', { recursive: true })
}
execSync('tsc')
fs.cpSync('image', 'lib/image', { recursive: true })
fs.writeFileSync('akashic-lib.json', JSON.stringify({}))
execSync('akashic scan asset')
fs.renameSync('akashic-lib.json', 'lib/akashic-lib.json')
