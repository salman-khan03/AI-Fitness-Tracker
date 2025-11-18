/* eslint-env node */
import process from 'node:process'
import { createServer } from 'node:http'
import { parse } from 'node:url'
import { handleRequest } from './router.js'
import { initializeDatabase } from './lib/storage.js'
import { startReminderScheduler } from './scheduler.js'
import { loadEnv } from './lib/env.js'

loadEnv()
const PORT = Number.parseInt(process.env.PORT || '4000', 10)

await initializeDatabase()
startReminderScheduler()

const server = createServer(async (req, res) => {
  const urlObj = parse(req.url, true)
  await handleRequest(req, res, urlObj)
})

server.listen(PORT, () => {
  console.log(`API ready on http://localhost:${PORT}`)
})
