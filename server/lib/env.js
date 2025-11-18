/* eslint-env node */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const loadedFiles = new Set()

function parseLine(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) {
    return null
  }
  const delimiterIndex = trimmed.indexOf('=')
  if (delimiterIndex === -1) {
    return null
  }
  const key = trimmed.slice(0, delimiterIndex).trim()
  if (!key) {
    return null
  }
  let value = trimmed.slice(delimiterIndex + 1).trim()
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    value = value.slice(1, -1)
  }
  return { key, value }
}

export function loadEnv(fileName = '.env') {
  const filePath = resolve(process.cwd(), fileName)
  if (loadedFiles.has(filePath)) {
    return
  }
  if (!existsSync(filePath)) {
    return
  }
  const contents = readFileSync(filePath, 'utf8')
  const lines = contents.split(/\r?\n/)
  for (const line of lines) {
    const result = parseLine(line)
    if (result && !(result.key in process.env)) {
      process.env[result.key] = result.value
    }
  }
  loadedFiles.add(filePath)
}
