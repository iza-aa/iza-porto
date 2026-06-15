const { chromium } = require('playwright')
const { mkdirSync, writeFileSync } = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const imgs = {
  'tiepolo-rinaldo-garden': '1623c4af-9ac2-fd80-9e73-05f7d402c6bd',
  'tiepolo-armida-sleeping': '633f464c-203f-f7b9-a251-7a2073f4b05d',
  'tiepolo-nymph-satyr': 'c3a2056b-9a3a-6c30-fe34-6191e7f2de05',
  'ceiling-fresco': 'c0e3572f-f756-a351-fe0f-bcecb20a5090',
}

;(async () => {
  mkdirSync(path.join(ROOT, 'scripts/art'), { recursive: true })
  const browser = await chromium.launch({ headless: false })
  const ctx = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await ctx.newPage()

  // Visit the site root first so Cloudflare sets clearance cookies.
  await page.goto('https://www.artic.edu/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(6000)

  for (const [name, id] of Object.entries(imgs)) {
    const url = `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`
    try {
      // Use the page's own fetch (carries cookies + passes CF).
      const dataUrl = await page.evaluate(async (u) => {
        const r = await fetch(u)
        const blob = await r.blob()
        return await new Promise((res) => {
          const fr = new FileReader()
          fr.onload = () => res({ ok: r.ok, type: r.headers.get('content-type'), data: fr.result })
          fr.readAsDataURL(blob)
        })
      }, url)
      if (dataUrl.type && dataUrl.type.includes('image')) {
        const b64 = dataUrl.data.split(',')[1]
        writeFileSync(path.join(ROOT, 'scripts/art', `${name}.jpg`), Buffer.from(b64, 'base64'))
        console.log(`${name}: OK ${dataUrl.type}`)
      } else {
        console.log(`${name}: NOT IMAGE -> ${dataUrl.type}`)
      }
    } catch (e) {
      console.log(`${name}: ERROR ${e.message}`)
    }
  }
  await browser.close()
  console.log('done')
})()
