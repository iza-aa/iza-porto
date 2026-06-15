import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/shots', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('https://www.shopify.com/editions/winter2026', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3500) // let intro animations settle

// hero
await page.screenshot({ path: 'scripts/shots/01-hero.png' })

// scroll through the page capturing beats
const steps = 6
for (let i = 1; i <= steps; i++) {
  await page.evaluate((f) => window.scrollTo({ top: document.body.scrollHeight * f, behavior: 'instant' }), i / (steps + 1))
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `scripts/shots/0${i + 1}-scroll-${i}.png` })
}

// full page
await page.screenshot({ path: 'scripts/shots/full.png', fullPage: true })

await browser.close()
console.log('done')
