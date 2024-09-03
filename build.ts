import { execSync } from 'child_process'
import * as fs from 'node:fs'
import type { LibConfiguration } from '@akashic/akashic-cli-commons'

if (fs.existsSync('lib')) {
  fs.rmSync('lib', { recursive: true })
}
execSync('tsc')
fs.writeFileSync('akashic-lib.json', JSON.stringify({}, null, 2))
execSync('akashic scan asset')
const akashicLib = JSON.parse(fs.readFileSync('akashic-lib.json', { encoding: 'utf8' })) as LibConfiguration
for (const asset of akashicLib.assetList!.filter(a => a.path.match(/\.default\./) || a.path.match(/\/default\./))) {
  asset.global = true
}
fs.writeFileSync('akashic-lib.json', JSON.stringify(akashicLib, null, 2))
