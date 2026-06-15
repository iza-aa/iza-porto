const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.stack || e.message))
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()) })
  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(8000)
  // dump the loading-related state by reading React error overlay if any
  const overlay = await page.evaluate(() => {
    const el = document.querySelector('nextjs-portal') || document.querySelector('[data-nextjs-dialog]')
    return el ? el.textContent.slice(0, 600) : null
  })
  console.log('=== PAGE ERRORS ===')
  console.log(errs.length ? errs.join('\n---\n').slice(0, 2000) : 'none')
  console.log('=== NEXT OVERLAY ===')
  console.log(overlay || 'none')
  await browser.close()
})()
