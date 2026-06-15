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
  await page.screenshot({ path: path.join(OUT, 't0-hero-patmos.png') })

  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: path.join(OUT, 't1-burn.png') })
  await page.waitForTimeout(3200)
  await page.screenshot({ path: path.join(OUT, 't2-about.png') })
  await browser.close()
  console.log('done')
})()
