import { execSync } from 'child_process'
import * as fs from 'node:fs'

if (fs.existsSync('lib')) {
  fs.rmSync('lib', { recursive: true })
}
execSync('tsc')
fs.cpSync('image', 'lib/image', { recursive: true })
