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
  await page.screenshot({ path: path.join(OUT, 't-extended.png') })

  // scroll to selected systems title
  for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(500) }
  await page.screenshot({ path: path.join(OUT, 't-selected.png') })

  // skills + experience
  for (let i = 0; i < 7; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(500) }
  await page.screenshot({ path: path.join(OUT, 't-skills.png') })
  for (let i = 0; i < 7; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(500) }
  await page.screenshot({ path: path.join(OUT, 't-exp.png') })

  console.log('done')
  await browser.close()
})()
