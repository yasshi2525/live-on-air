#!/usr/bin/env ts-node

import { cpSync } from 'node:fs'

cpSync('src', '../doc/sample', { recursive: true })
