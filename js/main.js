// main.js — Carabeo 26
// ─────────────────────────────────────────────────────────────────────────

// ⚠️ URL del Apps Script — rellenar tras el despliegue (ver web/apps-script/SETUP.md)
const SITE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUZMZYYiCw7ka71f9ze892IJGJ4Tj0TUrYKrWlIvBVjsQD6p3ejkUiuFYlHMF0UrsNww/exec'

// ═══════════════════════════════════════════════════════════════════════
// GALERÍA — edita esta lista para elegir qué fotos aparecen.
//   · La primera es la imagen principal del mosaico.
//   · Para quitar una foto: borra o comenta su línea.
//   · Para añadir una: copia una línea y cambia el slug.
//   · Slugs disponibles: mira los ficheros en web/img/ (sin extensión).
// ═══════════════════════════════════════════════════════════════════════
const GALLERY_IMAGES = [
  { slug: 'vistas',                  alt: 'gallery.alt.vistas' },
  { slug: 'terraza',                 alt: 'gallery.alt.terraza' },
  { slug: 'terraza-1',               alt: 'gallery.alt.terraza' },
  { slug: 'terraza-6',               alt: 'gallery.alt.terraza' },
  { slug: 'terraza-7',               alt: 'gallery.alt.terraza' },
  { slug: 'salon-cocina',            alt: 'gallery.alt.salonCocina' },
  { slug: 'salon',                   alt: 'gallery.alt.salon' },
  { slug: 'cocina',                  alt: 'gallery.alt.cocina' },
  { slug: 'dormitorio-matrimonio-1', alt: 'gallery.alt.matrimonio' },
  { slug: 'dormitorio-doble-2',      alt: 'gallery.alt.doble' },
  { slug: 'bano',                    alt: 'gallery.alt.bano' },
  { slug: 'terraza-pequena',         alt: 'gallery.alt.terrazaPeq' },
]

// Rangos de fechas ocupadas cargados desde el iCal (null = aún no cargado)
let _bookedRanges = null

// Índice activo del lightbox
let _lbIndex = 0

document.addEventListener('DOMContentLoaded', () => {
  initNavMovil()
  initGallery()
  initBookingForm()
  initCalendar()
  initLightbox()
})

window.addEventListener('carabeo26:langchange', () => {
  // Re-renderiza el mosaico para actualizar textos (alt, botón)
  const mosaic = document.getElementById('galleryMosaic')
  if (mosaic) renderMosaic(mosaic)

  // Re-renderiza el calendario para actualizar nombres de mes/semana
  const cal = document.getElementById('calendar')
  if (cal && _bookedRanges !== null) renderCalendar(cal, _bookedRanges)
})

// ─── Nav móvil ────────────────────────────────────────────────────────────

function initNavMovil() {
  const toggle = document.getElementById('navToggle')
  const menu   = document.getElementById('mobileMenu')
  if (!toggle || !menu) return

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden')
    menu.classList.toggle('hidden', isOpen)
    toggle.setAttribute('aria-expanded', String(!isOpen))
  })

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden')
      toggle.setAttribute('aria-expanded', 'false')
    })
  })
}

// ─── Galería: mosaico + lightbox ─────────────────────────────────────────

function initGallery() {
  const mosaic = document.getElementById('galleryMosaic')
  if (!mosaic || !GALLERY_IMAGES.length) return
  renderMosaic(mosaic)
}

function renderMosaic(container) {
  if (!GALLERY_IMAGES.length) return
  const imgs     = GALLERY_IMAGES
  const main     = imgs[0]
  const thumbs   = imgs.slice(1, 5)
  const total    = imgs.length
  const btnLabel = window.t('gallery.viewAll') + (total > 5 ? ` · ${total}` : '')

  const mosaicImg = (img, index, extraCls = '') => `
    <div class="overflow-hidden cursor-pointer group relative ${extraCls}" data-lb="${index}">
      <picture class="block w-full h-full">
        <source srcset="img/${img.slug}.webp" type="image/webp">
        <img src="img/${img.slug}.jpg" alt="${window.t(img.alt)}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             loading="${index === 0 ? 'eager' : 'lazy'}">
      </picture>
    </div>`

  container.innerHTML = `
    <div class="relative">
      <!-- Móvil: imagen principal única -->
      <div class="md:hidden aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer" data-lb="0">
        <picture class="block w-full h-full">
          <source srcset="img/${main.slug}.webp" type="image/webp">
          <img src="img/${main.slug}.jpg" alt="${window.t(main.alt)}"
               class="w-full h-full object-cover" loading="eager">
        </picture>
      </div>

      <!-- Desktop: mosaico 5 fotos -->
      <div class="hidden md:grid rounded-2xl overflow-hidden bg-slate-200 h-[32rem]"
           style="grid-template-columns:2fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:3px">
        ${mosaicImg(main, 0, 'row-span-2')}
        ${thumbs.map((img, i) => mosaicImg(img, i + 1)).join('')}
      </div>

      <!-- Botón "Ver todas las fotos" -->
      <button id="btnViewAll" type="button"
              class="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-colors">
        <i class="ti ti-camera text-base text-sea" aria-hidden="true"></i>
        <span>${btnLabel}</span>
      </button>
    </div>`

  // Listeners: clic en cualquier imagen o en el botón
  container.querySelectorAll('[data-lb]').forEach(el => {
    el.addEventListener('click', () => openLightbox(parseInt(el.dataset.lb)))
  })
  container.querySelector('#btnViewAll').addEventListener('click', () => openLightbox(0))
}

// ─── Lightbox ─────────────────────────────────────────────────────────────

function initLightbox() {
  document.getElementById('lbClose').addEventListener('click', closeLightbox)
  document.getElementById('lbPrev').addEventListener('click', () => lbNav(-1))
  document.getElementById('lbNext').addEventListener('click', () => lbNav(+1))

  // Cerrar al hacer clic en el fondo
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox()
  })

  // Teclado
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox')
    if (lb.classList.contains('hidden')) return
    if (e.key === 'Escape')     { closeLightbox(); e.preventDefault() }
    if (e.key === 'ArrowLeft')  { lbNav(-1);       e.preventDefault() }
    if (e.key === 'ArrowRight') { lbNav(+1);       e.preventDefault() }
  })
}

function openLightbox(index) {
  _lbIndex = index
  lbSetImage(_lbIndex)
  const lb = document.getElementById('lightbox')
  lb.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
  document.getElementById('lbClose').focus()
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden')
  document.body.style.overflow = ''
}

function lbNav(dir) {
  _lbIndex = (_lbIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
  lbSetImage(_lbIndex)
}

function lbSetImage(index) {
  const img = GALLERY_IMAGES[index]
  document.getElementById('lbSource').srcset = `img/${img.slug}.webp`
  document.getElementById('lbImg').src       = `img/${img.slug}.jpg`
  document.getElementById('lbImg').alt       = window.t(img.alt)
  document.getElementById('lbCaption').textContent = window.t(img.alt)
  document.getElementById('lbCounter').textContent = `${index + 1} / ${GALLERY_IMAGES.length}`
}

// ─── Formulario de reserva directa ───────────────────────────────────────

function initBookingForm() {
  const form    = document.getElementById('bookingForm')
  const success = document.getElementById('formSuccess')
  const btn     = document.getElementById('bookingSubmit')
  const errEl   = document.getElementById('bookingError')
  if (!form) return

  const today = new Date().toISOString().split('T')[0]
  form.querySelector('[name="checkin_date"]').min  = today
  form.querySelector('[name="checkout_date"]').min = today

  form.querySelector('[name="checkin_date"]').addEventListener('change', e => {
    const co = form.querySelector('[name="checkout_date"]')
    if (e.target.value) {
      co.min = e.target.value
      if (co.value && co.value <= e.target.value) co.value = ''
    }
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    errEl.classList.add('hidden')

    const checkin  = form.querySelector('[name="checkin_date"]').value
    const checkout = form.querySelector('[name="checkout_date"]').value
    const name     = form.querySelector('[name="name"]').value.trim()
    const email    = form.querySelector('[name="email"]').value.trim()

    if (!checkin || !checkout || !name || !email) {
      showFormError(errEl, window.t('form.errorRequired')); return
    }
    if (checkout <= checkin) {
      showFormError(errEl, window.t('form.errorDates'))
      form.querySelector('[name="checkout_date"]').focus(); return
    }

    const origText  = btn.textContent
    btn.disabled    = true
    btn.textContent = window.t('form.submitting')

    try {
      if (SITE_APPS_SCRIPT_URL) {
        await fetch(SITE_APPS_SCRIPT_URL, {
          method: 'POST', body: new URLSearchParams(new FormData(form)), mode: 'no-cors'
        })
      } else {
        console.warn('[main.js] SITE_APPS_SCRIPT_URL no configurada. Simulando envío.')
        await new Promise(r => setTimeout(r, 800))
      }
      form.classList.add('hidden')
      success.classList.remove('hidden')
      success.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      console.error('[main.js] Error de envío:', err)
      showFormError(errEl, window.t('form.errorNetwork'))
      btn.disabled    = false
      btn.textContent = origText
    }
  })
}

function showFormError(el, msg) {
  el.textContent = msg
  el.classList.remove('hidden')
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

// ─── Calendario de disponibilidad ────────────────────────────────────────

function initCalendar() {
  const container = document.getElementById('calendar')
  if (!container) return

  container.innerHTML = calendarLoading()

  if (!SITE_APPS_SCRIPT_URL) {
    container.innerHTML = calendarMsg(window.t('calendar.notConfigured'))
    _bookedRanges = []
    return
  }

  fetch(`${SITE_APPS_SCRIPT_URL}?action=ical`)
    .then(r => r.json())
    .then(data => {
      if (data.result === 'ok') {
        _bookedRanges = data.ranges || []
        renderCalendar(container, _bookedRanges)
      } else {
        console.error('[calendar] Apps Script error:', data.error)
        container.innerHTML = calendarMsg(window.t('calendar.error'), true)
        _bookedRanges = []
      }
    })
    .catch(err => {
      console.error('[calendar] Fetch error:', err)
      container.innerHTML = calendarMsg(window.t('calendar.error'), true)
      _bookedRanges = []
    })
}

function renderCalendar(container, ranges) {
  const booked = new Set()
  for (const { start, end } of ranges) {
    const s = localDate(start), e = localDate(end)
    for (const d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
      booked.add(localDateStr(d))
    }
  }
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const months = []
  for (let i = 0; i < 6; i++) {
    const first = new Date(today.getFullYear(), today.getMonth() + i, 1)
    months.push(renderMonth(first, today, booked))
  }
  container.innerHTML = `
    <div class="grid md:grid-cols-3 divide-y divide-slate-100">
      ${months.join('')}
    </div>`
}

function renderMonth(firstDay, today, booked) {
  const monthNames = window.t('months')
  const wdNames    = window.t('weekdays')
  const y = firstDay.getFullYear(), m = firstDay.getMonth()
  const name = Array.isArray(monthNames) ? monthNames[m] : ''
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const todayStr = localDateStr(today)
  const offset   = (firstDay.getDay() + 6) % 7

  const wdHeader = Array.isArray(wdNames)
    ? wdNames.map(w => `<div class="text-center text-[10px] font-semibold text-slate-400 pb-1 uppercase">${w}</div>`).join('')
    : ''

  let cells = Array(offset).fill('<div></div>').join('')
  for (let day = 1; day <= daysInMonth; day++) {
    const d    = new Date(y, m, day)
    const dStr = localDateStr(d)
    const past     = d < today
    const isToday  = dStr === todayStr
    const occupied = !past && booked.has(dStr)

    let cls = 'flex items-center justify-center w-8 h-8 rounded-full text-sm mx-auto select-none '
    if (past)          cls += 'text-slate-300'
    else if (occupied) cls += 'bg-slate-200 text-slate-500'
    else               cls += 'text-slate-700'
    if (isToday)       cls += ' ring-2 ring-sea font-bold'

    cells += `<div class="py-0.5"><span class="${cls}" title="${dStr}">${day}</span></div>`
  }

  return `
    <div class="px-4 sm:px-6 py-5">
      <h3 class="text-center font-semibold text-slate-700 mb-3 capitalize text-sm">${name} ${y}</h3>
      <div class="grid grid-cols-7 gap-x-0 gap-y-0.5">${wdHeader}${cells}</div>
    </div>`
}

function localDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function calendarLoading() {
  return `<div class="flex items-center justify-center min-h-[8rem] text-slate-400 text-sm gap-2">
    <svg class="animate-spin w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <span>${window.t('calendar.loading')}</span>
  </div>`
}

function calendarMsg(msg, isError = false) {
  const cls = isError ? 'text-red-400' : 'text-slate-400'
  return `<div class="flex items-center justify-center min-h-[8rem] text-sm ${cls} px-4 text-center">${msg}</div>`
}
