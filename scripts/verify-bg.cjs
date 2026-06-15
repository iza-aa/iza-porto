const { chromium } = require('playwright')
const { mkdirSync } = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')
const BASE = process.env.BASE || 'http://localhost:3100'

;(async () => {
  mkdirSync(path.join(ROOT, 'scripts/verify'), { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(6000)

  // clear the gesture-locked hero: hero -> about -> project
  await page.mouse.wheel(0, 300); await page.waitForTimeout(4600)
  await page.mouse.wheel(0, 300); await page.waitForTimeout(2800)
  await page.waitForTimeout(1200)

  // Fine-grained scroll through project/skills/experience to catch burns.
  // expose bg progress on window for logging if available
  const steps = 26
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 320)
    await page.waitForTimeout(550)
    await page.screenshot({ path: `scripts/verify/s${String(i).padStart(2, '0')}.png` })
  }
  console.log('final scrollY:', await page.evaluate(() => window.scrollY))
  await browser.close()
  console.log('done')
})()
