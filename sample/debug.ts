import * as fs from "node:fs";
import {execSync} from "node:child_process";

fs.rmSync('script', { force: true, recursive: true });

const entrypoint = JSON.parse(
  fs.existsSync('entrypoint.json') ?
    fs.readFileSync('entrypoint.json', 'utf8') :
    fs.readFileSync('entrypoint.sample.json', 'utf8')
).main

const _bootstrap = fs.readFileSync('_bootstrap.template.ts', 'utf-8')
fs.writeFileSync('_bootstrap.ts', `
${_bootstrap.replace(
  /import \{ main } from '\.\/main'/,
  `import { main } from '${entrypoint}'`)
}`)
fs.writeFileSync('game.json', `
{
  "width": 1280,
  "height": 720,
  "fps": 30,
  "main": "./script/_bootstrap.js",
  "environment": {
    "sandbox-runtime": "3",
    "nicolive": {
      "supportedModes": ["ranking"]
     }
  }
}`)

const teardown = () => {
  fs.rmSync('script', { force: true, recursive: true });
  fs.rmSync('_bootstrap.ts', { force: true })
  fs.rmSync('game.json', { force: true })
}

process.on('exit', () => {
  teardown()
  process.exit(0)
})

process.on('SIGINT', () => {
  teardown()
  process.exit(0)
})

try {
  execSync('npx tsc', { stdio: 'inherit' })
  execSync('npx akashic install @yasshi2525/live-on-air', { stdio: 'inherit' })
  execSync('npx akashic scan asset', { stdio: 'inherit' })
  execSync('npx akashic sandbox', { stdio: 'inherit' })
} catch (e) {
  const err = e as Error
  const stdout = (e as Record<string,Buffer>).stdout
  console.error(stdout?.toString())
  console.error(err.message)
  if (err.stack) {
    console.error(err.stack)
  }
}
