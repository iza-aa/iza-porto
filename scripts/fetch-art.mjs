import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

mkdirSync('scripts/art', { recursive: true })

const imgs = {
  'tiepolo-rinaldo-garden': '1623c4af-9ac2-fd80-9e73-05f7d402c6bd',
  'tiepolo-armida-sleeping': '633f464c-203f-f7b9-a251-7a2073f4b05d',
  'tiepolo-nymph-satyr': 'c3a2056b-9a3a-6c30-fe34-6191e7f2de05',
  'ceiling-fresco': 'c0e3572f-f756-a351-fe0f-bcecb20a5090',
}

const browser = await chromium.launch()
const ctx = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
})
const page = await ctx.newPage()

for (const [name, id] of Object.entries(imgs)) {
  const url = `https://www.artic.edu/iiif/2/${id}/full/600,/0/default.jpg`
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
  // if Cloudflare challenge appears, give it a moment then retry
  if (!resp || resp.headers()['content-type']?.includes('text/html')) {
    await page.waitForTimeout(4000)
    const r2 = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    const buf = await r2.body()
    writeFileSync(`scripts/art/${name}.jpg`, buf)
    console.log(`${name}: retried, ${buf.length} bytes, ${r2.headers()['content-type']}`)
  } else {
    const buf = await resp.body()
    writeFileSync(`scripts/art/${name}.jpg`, buf)
    console.log(`${name}: ${buf.length} bytes, ${resp.headers()['content-type']}`)
  }
}

await browser.close()
console.log('done')
