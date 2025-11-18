/* eslint-env node */
import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'

export function generateId(prefix = 'id') {
  return `${prefix}_${randomUUID()}`
}

export function parseJson(body) {
  try {
    return JSON.parse(body)
  } catch {
    const err = new Error('Invalid JSON payload')
    err.statusCode = 400
    throw err
  }
}

export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  })
  res.end(body)
}

export function sendNoContent(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end()
}

export async function readRequestBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  if (chunks.length === 0) {
    return ''
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function toISODate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    const err = new Error('Invalid date value')
    err.statusCode = 400
    throw err
  }
  return date.toISOString().slice(0, 10)
}

export function clampNumber(value, min, max) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return min
  }
  return Math.min(Math.max(value, min), max)
}

export function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}
