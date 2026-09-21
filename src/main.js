import './style.css'
import quotesSource from './quotes-fa.txt?raw'
import englishSource from './quotes-en.txt?raw'

 const firstTranslations = [
   'Some pain cannot be seen or spoken;\nit simply empties a person from the inside, little by little.',
   'Sometimes a person does not break;\nthey simply stop caring about things the way they used to.',
   'The hardest pain is not someone being gone;\nit is having someone who is no longer the same.',
   'I am fine...\nI just no longer have the energy to explain how I feel.',
   'Some people do not leave;\nthey simply turn from a presence in your heart into a memory.',
   'No one understood how many times I had broken myself\nbehind that “I am fine.”',
   'Sometimes silence is the last thing\nleft of a tired person.',
   'I miss myself;\nthe person I was before all this pain.',
 ]
 const cleanLine = (line) => line.replace(/[\uFEFF\u200E\u200B]/g, '').trim()
 const toEnglishFallback = () => ''
 const parseQuotes = (source) => {
   const normalized = source.replace(/\r/g, '').replace(/\u2028/g, '\n').split('\n').map(cleanLine)
   const markerIndex = normalized.findIndex((line) => line === '۸')
   const opening = normalized.slice(0, markerIndex).filter(Boolean)
   const result = [{ fa: opening.slice(0, 2).join('\n'), en: firstTranslations[0] }]
   for (let index = 1; index <= 7; index += 1) {
     const marker = ['۱', '۲', '۳', '۴', '۵', '۶', '۷'][index - 1]
     const start = opening.indexOf(`${marker}.`)
     result.push({ fa: opening.slice(start + 1, start + 3).join('\n'), en: firstTranslations[index] })
   }
   const remaining = normalized.slice(markerIndex + 1).filter(Boolean)
   remaining.forEach((fa) => result.push({ fa, en: toEnglishFallback(fa) }))
   return result
 }
 const quotes = parseQuotes(quotesSource)
 const pageCount = quotes.length
 let currentPage = Number(localStorage.getItem('khamoshi-page') || 8)
 const toFa = (value) => String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit])
 const pageLabel = (value) => toFa(String(value).padStart(2, '0'))
 const parseEnglishQuotes = (source, persianQuotes) => {
   const lines = source.replace(/\r/g, '').replace(/\u2028/g, '\n').split('\n').map((line) => line.trim()).filter(Boolean)
   let cursor = 0
   return persianQuotes.map((quote) => {
     const lineCount = quote.fa.split('\n').length
     const translated = lines.slice(cursor, cursor + lineCount).join('\n')
     cursor += lineCount
     return translated
   })
 }
 const englishQuotes = parseEnglishQuotes(englishSource, quotes)
 
 const storedUser = JSON.parse(localStorage.getItem('khamoshi-user') || 'null')
 const accounts = JSON.parse(localStorage.getItem('khamoshi-accounts') || '{}')
 if (storedUser?.email && !accounts[storedUser.email]) {
   accounts[storedUser.email] = storedUser
   localStorage.setItem('khamoshi-accounts', JSON.stringify(accounts))
 }
 let currentUser = storedUser
 let purchaseKey = currentUser ? `khamoshi-purchased-${currentUser.email}` : ''
 let hasPurchased = Boolean(purchaseKey && localStorage.getItem(purchaseKey) === 'true')
 document.querySelector('#app').innerHTML = `
  <section class="welcome-screen" id="welcome-screen" aria-labelledby="welcome-title">
   <div class="welcome-orbit welcome-orbit-one"></div><div class="welcome-orbit welcome-orbit-two"></div>
  <div class="welcome-content"><span class="kicker">یک مکث برای خودت</span><img class="welcome-logo" src="/night-book-logo.svg" alt="" /><p class="welcome-overline">کتاب دیجیتال</p><h1 id="welcome-title">بعد از تو،<br><em>هیچ‌کس</em></h1><p class="welcome-description" id="welcome-description">برای شروع، یک حساب بساز یا وارد حساب خودت شو.</p><button class="welcome-button" id="auth-start">ورود / ساخت حساب <span>←</span></button><div class="account-actions is-hidden" id="account-actions"><span class="account-email" id="account-email"></span><button class="welcome-button" id="buy-book">خرید کتاب <span>←</span></button><button class="welcome-button is-hidden" id="open-book">باز کردن کتاب <span>←</span></button><button class="logout-button" id="welcome-logout">خروج از حساب</button></div><small class="welcome-note">آهسته بخوان؛ اینجا عجله‌ای نیست.</small></div>
   <div class="welcome-footer"><span>365 نوشته برای شب</span><span>BAAD AZ TO, HICHKAS</span></div>
  </section>
  <div class="book-experience is-locked" id="book-experience">
  <header class="site-header"><a href="#top" class="wordmark"><img class="book-logo-image" src="/night-book-logo.svg" alt="لوگوی کتاب" /><span><b>بعد از تو، هیچ‌کس</b><small>جمله‌هایی برای شب‌هایی که حرفی برای گفتن نیست</small></span></a><nav><a href="#about">درباره کتاب</a><a href="#preview">پیش‌نمایش</a></nav><button class="theme-toggle" id="theme-toggle" title="حالت روز" aria-label="تغییر حالت روز و شب">☼</button><button class="header-read" id="header-read">مطالعه کتاب <span>↗</span></button><button class="header-logout" id="header-logout">خروج</button></header>
   <main id="top">
    <section class="cover-section"><div class="cover-copy"><span class="kicker">یک کتاب دیجیتال</span><h1>365</h1><p>جمله‌هایی برای<br><em>شب‌هایی که حرفی برای گفتن نیست.</em></p><button class="primary-button" id="start-reading">مطالعه کتاب <span>←</span></button></div><div class="cover-art" aria-label="جلد تاریک کتاب"><div class="cover-line"></div><div class="cover-title">بعد از تو، هیچ‌کس<small>365 نوشته برای شب</small></div><div class="cover-glow"></div></div><div class="cover-scroll">پایین بروید <span>↓</span></div></section>
     <section class="about-section" id="about"><div class="section-index">۰۱ <i></i> درباره کتاب</div><div class="about-grid"><h2>برای حرف‌هایی<br><em>که گفته نشدند.</em></h2><div><p>این کتاب مجموعه‌ای‌ست از ۳۶۵ جمله کوتاه درباره دلتنگی، تنهایی، سکوت، جدایی و چیزهایی که گاهی نمی‌توانیم به زبان بیاوریم.</p><p class="muted">هر صفحه فقط یک جمله دارد. آهسته بخوان؛ شاید یکی از آن‌ها شبیه چیزی باشد که مدت‌هاست در دل تو مانده.</p></div></div></section>
    <section class="reader-section" id="reader"><div class="section-index">۰۲ <i></i> ورق بزن</div><button class="open-map" id="open-map"><span>▦</span> نمای همه صفحه‌ها</button><div class="reader-layout"><aside class="reader-note"><span class="vertical-label">برای تو</span><img class="reader-logo-image" src="/night-book-logo.svg" alt="" /><p>یک جمله.<br>یک مکث.<br>یک شب.</p></aside><article class="book-page"><button class="page-expand" id="page-expand" title="بزرگ کردن صفحه" aria-label="بزرگ کردن صفحه">⛶</button><div class="page-top"><span>بعد از تو، هیچ‌کس</span><span id="page-date">صفحه ${pageLabel(currentPage)} / ${toFa(pageCount)}</span></div><div class="quote-wrap"><span class="quote-mark">“</span><blockquote id="quote"></blockquote><span class="english-quote" id="english-quote"></span><span class="quote-author">— از دفتر شب‌های بی‌صدا</span></div><div class="page-bottom"><span>هر صفحه، یک نفس</span><span id="page-progress"></span></div></article><div class="reader-controls"><div class="control-count"><b id="current-number">${pageLabel(currentPage)}</b><span>/ ${toFa(pageCount)}</span></div><div class="control-buttons"><button id="previous" aria-label="صفحه قبلی">←</button><button id="next" aria-label="صفحه بعدی">→</button></div><button class="language-toggle" id="language-toggle" title="مخفی کردن ترجمه انگلیسی" aria-label="مخفی کردن ترجمه انگلیسی">FA</button><button class="share-button" id="share-button" title="ساخت تصویر برای اشتراک‌گذاری" aria-label="ساخت تصویر برای اشتراک‌گذاری"><span>↗</span> اشتراک</button><div class="reader-progress"><span id="reader-progress-bar"></span></div></div></div></section>
     <section class="preview-section" id="preview"><div class="section-heading"><div><div class="section-index">۰۳ <i></i> چند صفحه از کتاب</div><h2>آهسته ورق بزن.</h2></div><span>یک پیش‌نمایش کوتاه از کتاب</span></div><div class="preview-grid" id="preview-grid"></div></section>
    <section class="ending-section"><img class="ending-logo-image" src="/night-book-logo.svg" alt="لوگوی کتاب" /><p>شاید بعضی حرف‌ها<br>فقط برای خوانده شدن‌اند.</p><span class="end-page">365 / 365</span></section>
   </main>
  <section class="page-map" id="page-map" aria-hidden="true"><div class="map-header"><div><span class="kicker">بعد از تو، هیچ‌کس</span><h2>همه‌ی صفحه‌ها</h2><p>یک صفحه را انتخاب کن تا باز شود.</p></div><button id="close-map" aria-label="بستن نمای صفحه‌ها">×</button></div><div class="mini-pages" id="mini-pages"></div></section>
  <section class="share-modal" id="share-modal" aria-hidden="true"><div class="share-dialog"><div class="share-heading"><div><span class="kicker">اشتراک‌گذاری</span><h2>این جمله را با خودت ببر.</h2></div><button id="close-share" aria-label="بستن">×</button></div><div class="share-workspace"><div class="share-preview"><canvas id="share-canvas" width="1080" height="1350" aria-hidden="true"></canvas><img id="share-image" alt="پیش‌نمایش تصویر اشتراک‌گذاری" /></div><div class="share-options"><span class="option-label">انتخاب قالب</span><div class="design-options"><button class="design-option active" data-design="night"><i></i><span>شب آرام</span></button><button class="design-option" data-design="paper"><i></i><span>کاغذ قدیمی</span></button><button class="design-option" data-design="rose"><i></i><span>غروب رز</span></button><button class="design-option" data-design="forest"><i></i><span>جنگل خاموش</span></button><button class="design-option" data-design="ocean"><i></i><span>آبی نیمه‌شب</span></button><button class="design-option" data-design="minimal"><i></i><span>سفید مینیمال</span></button><button class="design-option" data-design="poster"><i></i><span>پوستر بلند</span></button><button class="design-option" data-design="split"><i></i><span>دو نیمه</span></button><button class="design-option" data-design="frame"><i></i><span>قاب موزه</span></button><button class="design-option" data-design="circle"><i></i><span>دایره‌ی شب</span></button></div><button class="download-share" id="download-share">دانلود تصویر <span>↓</span></button><small>1080 × 1350 · مناسب پست اینستاگرام</small></div></div></div></section>
  <footer class="site-footer"><span>بعد از تو، هیچ‌کس</span><span>برای شب‌های طولانی</span><span>© ۱۴۰۵</span></footer>
  </div>
  <section class="auth-modal" id="auth-modal" aria-hidden="true"><div class="auth-dialog"><button class="auth-close" id="auth-close" aria-label="بستن">×</button><span class="kicker">حساب شخصی</span><h2>ایمیلت را تأیید کن.</h2><p id="auth-description">ایمیل خودت را وارد کن تا کد وریفیکیشن برایت فرستاده شود.</p><form id="auth-form"><label>ایمیل<input id="auth-email" name="email" type="email" required autocomplete="email" /></label><button class="welcome-button" id="send-code" type="submit">فرستادن کد <span>←</span></button></form><form class="is-hidden" id="code-form"><label>کد وریفیکیشن<input id="auth-code" name="code" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="one-time-code" /></label><button class="welcome-button" type="submit">تأیید ایمیل <span>←</span></button></form><small id="auth-message"></small></div></section>
  <section class="auth-modal" id="payment-modal" aria-hidden="true"><div class="auth-dialog payment-dialog"><button class="auth-close" id="payment-close" aria-label="بستن">×</button><span class="kicker">خرید کتاب</span><h2>یک مکث برای خودت.</h2><p>دسترسی کامل به ۳۶۵ صفحه کتاب دیجیتال.</p><div class="book-price"><small>$</small> 9.99 <small>USD</small></div><button class="welcome-button" id="pay-book">پرداخت و خرید کتاب <span>←</span></button><small id="payment-message"></small></div></section>
  <section class="auth-modal" id="purchase-success" aria-hidden="true"><div class="auth-dialog success-dialog"><span class="kicker">پرداخت موفق</span><h2>از خریدت سپاسگزاریم.</h2><p>کتاب برای حساب تو فعال شد. حالا می‌توانی با خیال راحت آن را باز کنی و آهسته بخوانی.</p><button class="logout-button" id="success-cancel">کنسل</button></div></section>
 `
 
 function renderPage() {
   const quote = quotes[(currentPage - 1) % quotes.length]
  document.querySelector('#quote').innerHTML = quote.fa.replace(/\n/g, '<br>')
  document.querySelector('#english-quote').innerHTML = englishQuotes[currentPage - 1]?.replace(/\n/g, '<br>') || ''
   document.querySelector('#current-number').textContent = pageLabel(currentPage)
   document.querySelector('#page-date').textContent = `صفحه ${pageLabel(currentPage)} / ${toFa(pageCount)}`
   document.querySelector('#page-progress').textContent = `${toFa(Math.round(currentPage / pageCount * 100))}٪ از کتاب`
   document.querySelector('#reader-progress-bar').style.width = `${currentPage / pageCount * 100}%`
  document.querySelectorAll('.mini-page').forEach((page) => page.classList.toggle('selected', Number(page.dataset.page) === currentPage))
   localStorage.setItem('khamoshi-page', currentPage)
 }
 function movePage(step) { currentPage = Math.min(pageCount, Math.max(1, currentPage + step)); renderPage() }
 document.querySelector('#previous').addEventListener('click', () => movePage(-1))
 document.querySelector('#next').addEventListener('click', () => movePage(1))
document.querySelector('#page-expand').addEventListener('click', () => { document.body.classList.toggle('page-expanded'); document.querySelector('#page-expand').textContent = document.body.classList.contains('page-expanded') ? '×' : '⛶' })
const pageMap = document.querySelector('#page-map')
 document.querySelector('#mini-pages').innerHTML = Array.from({ length: pageCount }, (_, index) => `<button class="mini-page ${index + 1 === currentPage ? 'selected' : ''}" data-page="${index + 1}" aria-label="صفحه ${pageLabel(index + 1)}"><span>${pageLabel(index + 1)}</span><i></i><b>${quotes[index].fa.split('\n')[0]}</b></button>`).join('')
document.querySelector('#open-map').addEventListener('click', () => { pageMap.classList.add('visible'); pageMap.setAttribute('aria-hidden', 'false'); document.querySelector('.mini-page.selected')?.scrollIntoView({ block: 'center' }) })
document.querySelector('#close-map').addEventListener('click', () => { pageMap.classList.remove('visible'); pageMap.setAttribute('aria-hidden', 'true') })
document.querySelector('#mini-pages').addEventListener('click', (event) => { const page = event.target.closest('.mini-page'); if (!page) return; currentPage = Number(page.dataset.page); renderPage(); pageMap.classList.remove('visible'); pageMap.setAttribute('aria-hidden', 'true'); document.querySelector('#reader').scrollIntoView({ behavior: 'smooth' }) })
const shareModal = document.querySelector('#share-modal')
const shareCanvas = document.querySelector('#share-canvas')
const shareImage = document.querySelector('#share-image')
const shareContext = shareCanvas.getContext('2d')
let selectedDesign = 'night'
function drawShareCard() {
  const quote = quotes[currentPage - 1].fa.replace(/\n/g, ' ')
  const englishQuote = englishQuotes[currentPage - 1] || ''
  const includeEnglish = !document.body.classList.contains('english-hidden') && Boolean(englishQuote)
  const designs = { night: { background: '#171315', foreground: '#eee3da', accent: '#c18c78', detail: 'moon' }, paper: { background: '#e8dfd5', foreground: '#392c2a', accent: '#997264', detail: 'paper' }, rose: { background: '#302a2d', foreground: '#eadfe0', accent: '#cf9ba0', detail: 'sun' }, forest: { background: '#182421', foreground: '#e4e8df', accent: '#a8b78d', detail: 'leaf' }, ocean: { background: '#172631', foreground: '#e0e8eb', accent: '#8eb4bf', detail: 'stars' }, minimal: { background: '#f2eee8', foreground: '#282322', accent: '#a77b6b', detail: 'line' }, poster: { background: '#bc8b76', foreground: '#241d1d', accent: '#f1ddd0', detail: 'poster' }, split: { background: '#ded4cb', foreground: '#312827', accent: '#9b6c61', detail: 'split' }, frame: { background: '#262022', foreground: '#eee2d8', accent: '#d2ac79', detail: 'frame' }, circle: { background: '#101d28', foreground: '#e0ebed', accent: '#78b3bc', detail: 'circle' } }
  const design = designs[selectedDesign]
  shareContext.direction = 'ltr'; shareContext.textAlign = 'left'
  shareContext.fillStyle = design.background; shareContext.fillRect(0, 0, 1080, 1350)
  shareContext.globalAlpha = .18; shareContext.fillStyle = design.accent
  if (design.detail === 'moon') { shareContext.beginPath(); shareContext.arc(850, 350, 125, 0, Math.PI * 2); shareContext.fill(); shareContext.fillStyle = design.background; shareContext.beginPath(); shareContext.arc(900, 315, 125, 0, Math.PI * 2); shareContext.fill() }
  if (design.detail === 'sun') { shareContext.beginPath(); shareContext.arc(870, 300, 150, 0, Math.PI * 2); shareContext.fill(); }
  if (design.detail === 'leaf') { for (let index = 0; index < 5; index += 1) { shareContext.save(); shareContext.translate(850 + index * 24, 270 + index * 24); shareContext.rotate(-.5); shareContext.beginPath(); shareContext.ellipse(0, 0, 18, 55, 0, 0, Math.PI * 2); shareContext.fill(); shareContext.restore() } }
  if (design.detail === 'stars') { for (let index = 0; index < 14; index += 1) { shareContext.beginPath(); shareContext.arc(760 + (index * 67) % 250, 170 + (index * 83) % 220, index % 3 + 2, 0, Math.PI * 2); shareContext.fill() } }
  if (design.detail === 'line') { shareContext.fillRect(90, 300, 900, 2); shareContext.fillRect(90, 1040, 900, 2) }
  shareContext.globalAlpha = 1
  if (design.detail === 'poster') { shareContext.fillStyle = design.accent; shareContext.fillRect(90, 180, 900, 4); shareContext.fillRect(90, 1130, 900, 4); shareContext.font = '700 150px DM Mono, monospace'; shareContext.fillText(String(currentPage).padStart(2, '0'), 90, 1090) }
  if (design.detail === 'split') { shareContext.fillStyle = design.accent; shareContext.fillRect(0, 0, 540, 1350); shareContext.fillStyle = design.background; shareContext.fillRect(540, 0, 540, 1350); shareContext.fillStyle = design.foreground; shareContext.font = '500 34px Estedad, sans-serif'; shareContext.direction = 'rtl'; shareContext.textAlign = 'right'; shareContext.fillText('بعد از تو، هیچ‌کس', 970, 1120) }
  if (design.detail === 'frame') { shareContext.strokeStyle = design.accent; shareContext.lineWidth = 16; shareContext.strokeRect(100, 130, 880, 1090); shareContext.lineWidth = 2; shareContext.strokeRect(125, 155, 830, 1040) }
  if (design.detail === 'circle') { shareContext.strokeStyle = `${design.accent}99`; shareContext.lineWidth = 4; shareContext.beginPath(); shareContext.arc(540, 650, 370, 0, Math.PI * 2); shareContext.stroke(); shareContext.beginPath(); shareContext.arc(540, 650, 395, 0, Math.PI * 2); shareContext.stroke() }
  shareContext.strokeStyle = `${design.accent}55`; shareContext.lineWidth = 2; shareContext.strokeRect(54, 54, 972, 1242)
  shareContext.fillStyle = design.accent; shareContext.font = '500 32px DM Mono, monospace'; shareContext.fillText('AFTER YOU, NO ONE', 90, 115)
  shareContext.font = '28px DM Mono, monospace'; shareContext.fillText(`${String(currentPage).padStart(2, '0')} / ${pageCount}`, 830, 115)
  shareContext.fillStyle = design.accent; shareContext.font = '110px Georgia, serif'; shareContext.fillText('“', 90, 355)
  shareContext.fillStyle = design.foreground; shareContext.font = '500 48px Estedad, sans-serif'; shareContext.direction = 'rtl'; shareContext.textAlign = 'right'
  const words = quote.split(' '); const lines = []; let line = ''
  words.forEach((word) => { const test = line ? `${line} ${word}` : word; if (shareContext.measureText(test).width > 820 && line) { lines.push(line); line = word } else line = test }); if (line) lines.push(line)
  const startY = includeEnglish ? 470 - ((lines.length - 1) * 24) : 535 - ((lines.length - 1) * 30); lines.forEach((text, index) => shareContext.fillText(text, 990, startY + index * (includeEnglish ? 68 : 82)))
  const dividerY = includeEnglish ? 830 : 930
  shareContext.strokeStyle = `${design.accent}88`; shareContext.lineWidth = 1; shareContext.beginPath(); shareContext.moveTo(90, dividerY); shareContext.lineTo(990, dividerY); shareContext.stroke()
  if (includeEnglish) {
    shareContext.direction = 'ltr'; shareContext.textAlign = 'left'; shareContext.fillStyle = design.accent; shareContext.font = '300 24px DM Mono, monospace'
    const englishLines = []; let englishLine = ''
    englishQuote.replace(/\n/g, ' ').split(' ').forEach((word) => { const test = englishLine ? `${englishLine} ${word}` : word; if (shareContext.measureText(test).width > 850 && englishLine) { englishLines.push(englishLine); englishLine = word } else englishLine = test }); if (englishLine) englishLines.push(englishLine)
    englishLines.slice(0, 3).forEach((text, index) => shareContext.fillText(text, 90, dividerY + 62 + index * 42))
  }
  shareContext.fillStyle = design.accent; shareContext.font = '28px Vazirmatn, sans-serif'; shareContext.direction = 'rtl'; shareContext.textAlign = 'right'; shareContext.fillText('بعد از تو، هیچ‌کس', 990, 1010)
  shareContext.font = '22px DM Mono, monospace'; shareContext.direction = 'ltr'; shareContext.textAlign = 'left'; shareContext.fillText(window.location.host, 90, 1240)
  shareImage.src = shareCanvas.toDataURL('image/png')
}
document.querySelector('#share-button').addEventListener('click', () => { shareModal.classList.add('visible'); shareModal.setAttribute('aria-hidden', 'false'); drawShareCard() })
document.querySelector('#close-share').addEventListener('click', () => { shareModal.classList.remove('visible'); shareModal.setAttribute('aria-hidden', 'true') })
shareModal.addEventListener('click', (event) => { if (event.target === shareModal) { shareModal.classList.remove('visible'); shareModal.setAttribute('aria-hidden', 'true') } })
document.querySelectorAll('.design-option').forEach((option) => option.addEventListener('click', () => { selectedDesign = option.dataset.design; document.querySelectorAll('.design-option').forEach((item) => item.classList.toggle('active', item === option)); drawShareCard() }))
document.querySelector('#download-share').addEventListener('click', () => { const link = document.createElement('a'); link.download = `baad-az-to-${currentPage}.png`; link.href = shareImage.src || shareCanvas.toDataURL('image/png'); link.click() })
 document.querySelector('#start-reading').addEventListener('click', () => document.querySelector('#reader').scrollIntoView({ behavior: 'smooth' }))
 document.querySelector('#header-read').addEventListener('click', () => document.querySelector('#reader').scrollIntoView({ behavior: 'smooth' }))
 const welcomeScreen = document.querySelector('#welcome-screen')
 const bookExperience = document.querySelector('#book-experience')
 const authModal = document.querySelector('#auth-modal')
 const authForm = document.querySelector('#auth-form')
 const codeForm = document.querySelector('#code-form')
 const authCodeInput = document.querySelector('#auth-code')
 const authDescription = document.querySelector('#auth-description')
 const authMessage = document.querySelector('#auth-message')
 const authStart = document.querySelector('#auth-start')
 const welcomeDescription = document.querySelector('#welcome-description')
 const accountActions = document.querySelector('#account-actions')
 const accountEmail = document.querySelector('#account-email')
 const buyBook = document.querySelector('#buy-book')
 const openBook = document.querySelector('#open-book')
 const welcomeLogout = document.querySelector('#welcome-logout')
 const headerLogout = document.querySelector('#header-logout')
 const paymentModal = document.querySelector('#payment-modal')
 const paymentMessage = document.querySelector('#payment-message')
 const payBook = document.querySelector('#pay-book')
 const purchaseSuccess = document.querySelector('#purchase-success')
 let pendingEmail = ''
 let pendingCode = ''
 let pendingAccount = null
 const updateAccountView = () => {
   authStart.classList.toggle('is-hidden', Boolean(currentUser))
   accountActions.classList.toggle('is-hidden', !currentUser)
   welcomeDescription.classList.toggle('is-hidden', Boolean(currentUser))
   if (!currentUser) return
   accountEmail.textContent = `${currentUser.name} · ${currentUser.email}`
   buyBook.classList.toggle('is-hidden', hasPurchased)
   openBook.classList.toggle('is-hidden', !hasPurchased)
 }
 const openAuthModal = () => { authForm.reset(); codeForm.reset(); authForm.classList.remove('is-hidden'); codeForm.classList.add('is-hidden'); authDescription.textContent = 'ایمیل خودت را وارد کن تا کد وریفیکیشن برایت فرستاده شود.'; authMessage.textContent = ''; authModal.classList.add('visible'); authModal.setAttribute('aria-hidden', 'false'); document.querySelector('#auth-email').focus() }
 const closeAuthModal = () => { authModal.classList.remove('visible'); authModal.setAttribute('aria-hidden', 'true'); authMessage.textContent = '' }
 const openPaymentModal = () => { paymentMessage.textContent = ''; paymentModal.classList.add('visible'); paymentModal.setAttribute('aria-hidden', 'false') }
 const closePaymentModal = () => { paymentModal.classList.remove('visible'); paymentModal.setAttribute('aria-hidden', 'true') }
 const closePurchaseSuccess = () => { purchaseSuccess.classList.remove('visible'); purchaseSuccess.setAttribute('aria-hidden', 'true') }
 const logOut = () => {
   currentUser = null
   purchaseKey = ''
   hasPurchased = false
   localStorage.removeItem('khamoshi-user')
   welcomeScreen.classList.remove('is-hidden')
   bookExperience.classList.add('is-locked')
   updateAccountView()
 }
 authStart.addEventListener('click', openAuthModal)
 document.querySelector('#auth-close').addEventListener('click', closeAuthModal)
 authModal.addEventListener('click', (event) => { if (event.target === authModal) closeAuthModal() })
 authForm.addEventListener('submit', (event) => {
   event.preventDefault()
   const formData = new FormData(authForm)
   const email = String(formData.get('email')).trim().toLowerCase()
   pendingEmail = email
  pendingAccount = accounts[email] || null
  pendingCode = '1111'
   authForm.classList.add('is-hidden')
   codeForm.classList.remove('is-hidden')
  authDescription.textContent = pendingAccount ? `کد ورود به حساب قبلی ${email} فرستاده شد.` : `کد ساخت حساب به ${email} فرستاده شد.`
   authMessage.textContent = `کد آزمایشی: ${pendingCode}`
   authCodeInput.focus()
 })
 codeForm.addEventListener('submit', (event) => {
   event.preventDefault()
   if (authCodeInput.value.trim() !== pendingCode) { authMessage.textContent = 'کد واردشده صحیح نیست.'; return }
  currentUser = pendingAccount || { name: pendingEmail.split('@')[0], email: pendingEmail }
  accounts[pendingEmail] = currentUser
   purchaseKey = `khamoshi-purchased-${pendingEmail}`
   hasPurchased = localStorage.getItem(purchaseKey) === 'true'
  localStorage.setItem('khamoshi-accounts', JSON.stringify(accounts))
   localStorage.setItem('khamoshi-user', JSON.stringify(currentUser))
   closeAuthModal()
   updateAccountView()
 })
 buyBook.addEventListener('click', openPaymentModal)
 document.querySelector('#payment-close').addEventListener('click', closePaymentModal)
 paymentModal.addEventListener('click', (event) => { if (event.target === paymentModal) closePaymentModal() })
 payBook.addEventListener('click', () => {
   hasPurchased = true
   localStorage.setItem(purchaseKey, 'true')
   closePaymentModal()
   updateAccountView()
   purchaseSuccess.classList.add('visible')
   purchaseSuccess.setAttribute('aria-hidden', 'false')
 })
 document.querySelector('#success-cancel').addEventListener('click', closePurchaseSuccess)
 purchaseSuccess.addEventListener('click', (event) => { if (event.target === purchaseSuccess) closePurchaseSuccess() })
 openBook.addEventListener('click', () => {
   welcomeScreen.classList.add('is-hidden')
   bookExperience.classList.remove('is-locked')
   document.querySelector('#top').scrollIntoView({ behavior: 'smooth' })
 })
 welcomeLogout.addEventListener('click', logOut)
 headerLogout.addEventListener('click', logOut)
 updateAccountView()
const themeToggle = document.querySelector('#theme-toggle')
const savedTheme = localStorage.getItem('khamoshi-theme')
if (savedTheme === 'light') document.body.classList.add('light-mode')
themeToggle.addEventListener('click', () => { document.body.classList.toggle('light-mode'); localStorage.setItem('khamoshi-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark'); themeToggle.textContent = document.body.classList.contains('light-mode') ? '☾' : '☼' })
const languageToggle = document.querySelector('#language-toggle')
 languageToggle.addEventListener('click', () => { const hidden = document.body.classList.toggle('english-hidden'); languageToggle.textContent = hidden ? 'EN' : 'FA'; languageToggle.title = hidden ? 'نمایش ترجمه انگلیسی' : 'مخفی کردن ترجمه انگلیسی'; languageToggle.setAttribute('aria-label', languageToggle.title) })
 document.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') movePage(1); if (event.key === 'ArrowRight') movePage(-1) })
 document.querySelector('#preview-grid').innerHTML = quotes.slice(1, 4).map((quote, index) => `<article class="preview-card"><span>${pageLabel(index + 2)}</span><p>${quote.fa.replace('\n', '<br>')}<small>${englishQuotes[index + 1].replace(/\n/g, '<br>')}</small></p><b>↗</b></article>`).join('')
 renderPage()
