const { chromium } = require('playwright')
const { mkdirSync } = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'scripts/verify')
const BASE = process.env.BASE || 'http://localhost:3100'

;(async () => {
  mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(6500)
  await page.mouse.wheel(0, 300); await page.waitForTimeout(4600)
  await page.mouse.wheel(0, 300); await page.waitForTimeout(2800)
  await page.waitForTimeout(1200)

  // Fine even steps across the whole project→experience to watch each painting's
  // zoom drift AND the handoff at each burn (looking for jumps).
  for (let i = 0; i < 34; i++) {
    await page.mouse.wheel(0, 170)
    await page.waitForTimeout(480)
    await page.screenshot({ path: path.join(OUT, `e${String(i).padStart(2, '0')}.png`) })
  }
  console.log('scrollY', await page.evaluate(() => window.scrollY), 'done')
  await browser.close()
})()
