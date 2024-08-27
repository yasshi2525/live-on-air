import { execSync } from 'child_process'
import * as fs from 'node:fs'

if (fs.existsSync('lib')) {
  fs.rmSync('lib', { recursive: true })
}
execSync('tsc')
fs.writeFileSync('akashic-lib.json', JSON.stringify({}))
execSync('akashic scan asset')
