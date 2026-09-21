import fs from 'node:fs/promises'
import translate from 'translate-google'

const source = (await fs.readFile('src/quotes-fa.txt', 'utf8'))
  .replace(/\r/g, '')
  .replace(/\u2028/g, '\n')
  .split('\n')
  .map((line) => line.replace(/[\uFEFF\u200E\u200B]/g, '').trim())
const markerIndex = source.findIndex((line) => line === '۸')
const opening = source.slice(0, markerIndex).filter(Boolean)
const quotes = [opening.slice(0, 2).join('\n')]
for (let index = 1; index <= 7; index += 1) {
  const marker = ['۱', '۲', '۳', '۴', '۵', '۶', '۷'][index - 1]
  const start = opening.indexOf(`${marker}.`)
  quotes.push(opening.slice(start + 1, start + 3).join('\n'))
}
quotes.push(...source.slice(markerIndex + 1).filter(Boolean))

const translated = []
for (let index = 0; index < quotes.length; index += 1) {
  const text = quotes[index]
  let result = ''
  for (let attempt = 1; attempt <= 3 && !result; attempt += 1) {
    try {
      result = await translate(text, { from: 'fa', to: 'en' })
    } catch (error) {
      if (attempt === 3) throw error
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    }
  }
  translated.push(result.replace(/\r/g, '').trim())
  console.log(`${index + 1}/${quotes.length}`)
}
await fs.writeFile('src/quotes-en.txt', `${translated.join('\n')}\n`)
