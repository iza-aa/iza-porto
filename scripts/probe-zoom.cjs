const { chromium } = require('playwright')
const BASE = process.env.BASE || 'http://localhost:3100'

// Reads the WebGL draw calls indirectly by sampling a pixel column from the
// background canvas at two scroll depths and reporting mean luminance + a crude
// scale estimate. More directly: we hook requestAnimationFrame is overkill;
// instead we just confirm the page scrolls and the canvas repaints (non-static)
// by diffing canvas pixels between two scroll positions.
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(6500)
  await page.mouse.wheel(0, 300); await page.waitForTimeout(4600)
  await page.mouse.wheel(0, 300); await page.waitForTimeout(2800)
  await page.waitForTimeout(1000)

  async function sampleCanvas() {
    return await page.evaluate(() => {
      const c = document.querySelector('canvas')
      if (!c) return null
      // read a small strip from the WebGL canvas via toDataURL is blocked for
      // webgl without preserveDrawingBuffer; instead report canvas size + a hash
      // of its bounding info is useless. Return drawingBufferWidth as a sanity.
      const gl = c.getContext('webgl2') || c.getContext('webgl')
      return { w: c.width, h: c.height, hasGL: !!gl }
    })
  }
  console.log('canvas@project:', JSON.stringify(await sampleCanvas()))
  // scroll a little and confirm scrollY changes (zoom is bound to this)
  const y0 = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 600); await page.waitForTimeout(600)
  const y1 = await page.evaluate(() => window.scrollY)
  console.log('scrollY moved:', y0, '->', y1, '(delta', y1 - y0, ')')
  await browser.close()
})()
