const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(3000)
    const pct = await page.evaluate(() => document.body.innerText.match(/(\d+)\s*%/)?.[1] ?? 'gone')
    console.log(`t=${(i + 1) * 3}s pct=${pct}`)
    if (pct === 'gone') break
  }
  await page.screenshot({ path: 'D:/iza-porto/scripts/verify/after-wait.png' })
  await browser.close()
})()
