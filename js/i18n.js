// i18n — Carabeo 26
// ─────────────────────────────────────────────────────────────────────────
// Diccionario bilingüe ES/EN + toggle + detección de idioma.
//
// Origen de los textos:
//   · La mayoría son LITERALES del brief (.claude/rules/brief-web-carabeo26.md).
//   · Marcados con [+] los que NO venían con traducción EN en el brief y se han
//     traducido/redactado aquí (títulos de sección y textos legales). Pendientes
//     de validación por el titular. Ver README.md.
//
// Uso en el HTML:
//   <h1 data-i18n="hero.title">…</h1>            → traduce textContent
//   <input data-i18n-placeholder="form.x">       → traduce placeholder
//   <button data-lang-btn="es|en">               → alterna idioma

const SUPPORTED = ['es', 'en']
const DEFAULT_LANG = 'es'
const STORAGE_KEY = 'carabeo26_lang'

const DICT = {
  es: {
    // ── Navegación (brief §1) ──
    'nav.apartment': 'El apartamento',
    'nav.gallery': 'Galería',
    'nav.location': 'Ubicación',
    'nav.book': 'Reservar',

    // ── Hero (brief §2) ──
    'hero.title': 'Apartamento en el centro de Nerja con vistas al mar',
    'hero.subtitle': '2 dormitorios · hasta 4 huéspedes · playa a 200 m',
    'hero.cta': 'Consultar disponibilidad',

    // ── Barra de confianza (brief §3) ──
    'trust.rating': '★ 4,93 · 109 evaluaciones',
    'trust.airbnbLabel': 'Ver valoraciones en Airbnb',
    'trust.superhost': 'Superanfitrión',
    'trust.selfcheckin': 'Llegada autónoma',

    // ── Banner reserva directa (brief §4) ──
    'directBanner.text': 'Reserva directa — mejor precio, sin comisiones de plataforma',

    // ── Disponibilidad (brief §5) ──
    'availability.title': 'Disponibilidad',
    'availability.legendFree': 'Libre',
    'availability.legendBooked': 'Ocupado',
    'availability.note': 'Disponibilidad actualizada automáticamente',

    // ── Galería ──
    'gallery.title': 'Galería',
    'gallery.viewAll': 'Ver todas las fotos',
    'gallery.close': 'Cerrar',

    // ── Alt de imágenes (hero + galería) ──
    'hero.alt': 'Terraza con vistas al mar del apartamento Carabeo 26 en Nerja',
    'gallery.alt.vistas': 'Vistas al mar desde la terraza',
    'gallery.alt.terraza': 'Terraza de 55 m² con zona de estar al aire libre',
    'gallery.alt.salon': 'Salón con aire acondicionado',
    'gallery.alt.cocina': 'Cocina totalmente equipada',
    'gallery.alt.comedor': 'Comedor',
    'gallery.alt.matrimonio': 'Dormitorio con cama de matrimonio',
    'gallery.alt.doble': 'Dormitorio con dos camas',
    'gallery.alt.bano': 'Baño completo',
    'gallery.alt.terrazaPeq': 'Terraza pequeña con vistas a la calle',
    'gallery.alt.salonCocina': 'Salón con cocina abierta',
    'gallery.alt.escaleras': 'Escalera interior de la casa',

    // ── El apartamento (brief §6) ──
    'apartment.title': 'El apartamento',
    'apartment.p1': 'Carabeo 26 es un apartamento luminoso dentro de una casa típica de pueblo, en pleno centro de Nerja y a solo 200 m de la playa.',
    'apartment.p2': 'En la primera planta hay dos dormitorios —uno con cama de matrimonio y otro con dos camas—, ambos con aire acondicionado, armario empotrado y balcón a la calle, además de un baño completo.',
    'apartment.p3': 'En la planta superior se encuentran el salón con aire acondicionado y televisión con canales internacionales, el comedor, la cocina totalmente equipada y dos terrazas: una pequeña a la calle y otra de 55 m² con vistas al mar, con mesa, sillones, dos tumbonas y zona de estar al aire libre.',

    // ── Características (brief §7) ──
    'features.title': 'Características',                                   // [+] título de sección
    'features.seaviews': 'Vistas al mar',
    'features.wifi': 'Wifi',
    'features.ac': 'Aire acondicionado',
    'features.kitchen': 'Cocina totalmente equipada',
    'features.tv': 'TV con canales internacionales',
    'features.workspace': 'Zona de trabajo',
    'features.terraces': 'Dos terrazas',
    'features.parking': 'Aparcamiento público enfrente',
    'features.kitchenDetailLabel': 'Cocina:',                            // [+] etiqueta
    'features.kitchenDetail': 'lavavajillas, lavadora, placa de inducción, microondas, cafetera de cápsulas, hervidor, tostador, exprimidor.',

    // ── Ubicación (brief §8) ──
    'location.title': 'Ubicación',
    'location.text': 'En el centro de Nerja, a 200 m de la playa y a un paseo del Balcón de Europa. Restaurantes, tiendas y zona peatonal a la puerta.',
    'location.address': 'Calle Carabeo, 26 · 29780 Nerja, Málaga',
    'location.mapLink': 'Ver en el mapa',
    'location.mapAlt': 'Mapa de la ubicación en Calle Carabeo 26, Nerja',

    // ── Normas (brief §9) ──
    'rules.title': 'Normas',                                             // [+] título de sección
    'rules.checkin': 'Entrada a partir de las 15:00',
    'rules.checkout': 'Salida antes de las 11:00',
    'rules.maxguests': 'Máximo 4 huéspedes',
    'rules.selfcheckin': 'Llegada autónoma con caja de llaves',

    // ── Formulario (brief §10) ──
    'form.title': 'Solicitar reserva directa',
    'form.checkin': 'Fecha de entrada',
    'form.checkout': 'Fecha de salida',
    'form.guests': 'Nº de huéspedes (máx. 4)',
    'form.name': 'Nombre',
    'form.email': 'Email',
    'form.phone': 'Teléfono (opcional)',
    'form.message': 'Mensaje (opcional)',
    'form.submit': 'Enviar solicitud',
    'form.success': '¡Gracias! Hemos recibido tu solicitud. Te responderemos lo antes posible.',
    'form.gdpr': 'Tus datos se usan únicamente para gestionar tu solicitud de reserva y no se ceden a terceros.',
    'form.gdprLink': 'Consulta la política de privacidad.',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.orForm': 'o rellena el formulario',

    'form.submitting': 'Enviando…',
    'form.errorRequired': 'Por favor rellena todos los campos obligatorios.',
    'form.errorDates': 'La fecha de salida debe ser posterior a la de entrada.',
    'form.errorNetwork': 'Algo ha ido mal. Por favor inténtalo de nuevo o escríbenos a carabeo26nerja@gmail.com.',

    // ── Calendario de disponibilidad ──
    'calendar.loading': 'Cargando disponibilidad…',
    'calendar.error': 'No se pudo cargar la disponibilidad. Inténtalo de nuevo más tarde.',
    'calendar.notConfigured': 'Disponibilidad próximamente.',
    'months': ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    'weekdays': ['Lu','Ma','Mi','Ju','Vi','Sá','Do'],

    // ── Footer (brief §12) ──
    'footer.registry': 'VFT/MA/53903 (Junta de Andalucía)',
    'footer.nationalRegistry': 'Registro nacional ESFCTU…539038',
    'footer.copyright': '© Carabeo 26',
    'footer.legal': 'Aviso legal',
    'footer.privacy': 'Privacidad',

    // ── Aviso legal (legal.html) — [+] estructura legal estándar, validar ──
    'legal.title': 'Aviso legal',
    'legal.holderTitle': 'Titular',
    'legal.holderBody': 'Responsable: [pendiente de completar por el titular] · Email de contacto: carabeo26nerja@gmail.com · Nerja (Málaga), España.',
    'legal.registryTitle': 'Datos registrales',
    'legal.registryBody': 'Vivienda con fines turísticos inscrita en el Registro de Turismo de Andalucía con número VFT/MA/53903. Registro nacional: ESFCTU0000290130000579000000000000000000VFT/MA/539038.',
    'legal.useTitle': 'Condiciones de uso',
    'legal.useBody': 'Este sitio web tiene como finalidad ofrecer información sobre el alojamiento Carabeo 26 y gestionar solicitudes de reserva directa. El uso del sitio implica la aceptación de estas condiciones.',
    'legal.lawTitle': 'Legislación aplicable',
    'legal.lawBody': 'Las presentes condiciones se rigen por la legislación española.',
    'legal.back': '← Volver al inicio',

    // ── Privacidad (privacy.html) — [+] estructura RGPD estándar, validar ──
    'privacy.title': 'Política de privacidad',
    'privacy.responsibleTitle': 'Responsable del tratamiento',
    'privacy.responsibleBody': 'Responsable: [pendiente de completar por el titular]. Contacto: carabeo26nerja@gmail.com.',
    'privacy.purposeTitle': 'Finalidad',
    'privacy.purposeBody': 'Tratamos los datos que nos facilitas en el formulario (nombre, email, teléfono, fechas de estancia, número de huéspedes y, opcionalmente, tu mensaje) con la única finalidad de gestionar tu solicitud de reserva directa.',
    'privacy.legalTitle': 'Base legal',
    'privacy.legalBody': 'El tratamiento se basa en tu consentimiento, otorgado al enviar el formulario de solicitud.',
    'privacy.recipientsTitle': 'Destinatarios',
    'privacy.recipientsBody': 'Tus datos no se ceden a terceros. Se almacenan en los servicios de Google (Sheets/Gmail) utilizados para recibir y gestionar la solicitud.',
    'privacy.retentionTitle': 'Conservación',
    'privacy.retentionBody': 'Conservamos los datos durante el tiempo necesario para gestionar tu solicitud y, en su caso, la estancia; después se eliminan salvo obligación legal de conservarlos.',
    'privacy.rightsTitle': 'Tus derechos',
    'privacy.rightsBody': 'Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a carabeo26nerja@gmail.com. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).',
    'privacy.back': '← Volver al inicio',
  },

  en: {
    // ── Navigation (brief §1) ──
    'nav.apartment': 'The apartment',
    'nav.gallery': 'Gallery',
    'nav.location': 'Location',
    'nav.book': 'Book',

    // ── Hero (brief §2) ──
    'hero.title': 'Apartment in the heart of Nerja with sea views',
    'hero.subtitle': '2 bedrooms · up to 4 guests · beach 200 m away',
    'hero.cta': 'Check availability',

    // ── Trust bar (brief §3) ──
    'trust.rating': '★ 4.93 · 109 reviews',
    'trust.airbnbLabel': 'View reviews on Airbnb',
    'trust.superhost': 'Superhost',
    'trust.selfcheckin': 'Self check-in',

    // ── Direct booking banner (brief §4) ──
    'directBanner.text': 'Book direct — best price, no platform fees',

    // ── Availability (brief §5) ──
    'availability.title': 'Availability',
    'availability.legendFree': 'Available',
    'availability.legendBooked': 'Booked',
    'availability.note': 'Availability updated automatically',

    // ── Gallery ──
    'gallery.title': 'Gallery',
    'gallery.viewAll': 'View all photos',
    'gallery.close': 'Close',

    // ── Image alt text (hero + gallery) ──
    'hero.alt': 'Sea-view terrace of the Carabeo 26 apartment in Nerja',
    'gallery.alt.vistas': 'Sea views from the terrace',
    'gallery.alt.terraza': '55 m² terrace with an outdoor lounge area',
    'gallery.alt.salon': 'Living room with air conditioning',
    'gallery.alt.cocina': 'Fully equipped kitchen',
    'gallery.alt.comedor': 'Dining area',
    'gallery.alt.matrimonio': 'Bedroom with a double bed',
    'gallery.alt.doble': 'Bedroom with two single beds',
    'gallery.alt.bano': 'Full bathroom',
    'gallery.alt.terrazaPeq': 'Small terrace overlooking the street',
    'gallery.alt.salonCocina': 'Living room with open kitchen',
    'gallery.alt.escaleras': 'Interior staircase of the house',

    // ── The apartment (brief §6) ──
    'apartment.title': 'The apartment',
    'apartment.p1': 'Carabeo 26 is a bright apartment set within a traditional townhouse, right in the centre of Nerja and just 200 m from the beach.',
    'apartment.p2': 'The first floor has two bedrooms —one with a double bed and one with two single beds—, both with air conditioning, a built-in wardrobe and a balcony facing the street, plus a full bathroom.',
    'apartment.p3': "Upstairs you'll find the living room with air conditioning and a TV with international channels, the dining area, a fully equipped kitchen and two terraces: a small one facing the street and a 55 m² one with sea views, featuring a table, armchairs, two sun loungers and an outdoor lounge area.",

    // ── Amenities (brief §7) ──
    'features.title': 'Amenities',                                       // [+] section title
    'features.seaviews': 'Sea views',
    'features.wifi': 'Wifi',
    'features.ac': 'Air conditioning',
    'features.kitchen': 'Fully equipped kitchen',
    'features.tv': 'TV with international channels',
    'features.workspace': 'Workspace',
    'features.terraces': 'Two terraces',
    'features.parking': 'Public parking opposite',
    'features.kitchenDetailLabel': 'Kitchen:',                           // [+] label
    'features.kitchenDetail': 'dishwasher, washing machine, induction hob, microwave, capsule coffee machine, kettle, toaster, juicer.',

    // ── Location (brief §8) ──
    'location.title': 'Location',
    'location.text': 'In the centre of Nerja, 200 m from the beach and a short walk from the Balcón de Europa. Restaurants, shops and the pedestrian area right at your doorstep.',
    'location.address': 'Calle Carabeo, 26 · 29780 Nerja, Málaga',
    'location.mapLink': 'View on the map',
    'location.mapAlt': 'Map of the location at Calle Carabeo 26, Nerja',

    // ── House rules (brief §9) ──
    'rules.title': 'House rules',                                        // [+] section title
    'rules.checkin': 'Check-in from 3:00 PM',
    'rules.checkout': 'Check-out before 11:00 AM',
    'rules.maxguests': 'Maximum 4 guests',
    'rules.selfcheckin': 'Self check-in with key lockbox',

    // ── Booking form (brief §10) ──
    'form.title': 'Request a direct booking',
    'form.checkin': 'Check-in date',
    'form.checkout': 'Check-out date',
    'form.guests': 'Number of guests (max. 4)',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone (optional)',
    'form.message': 'Message (optional)',
    'form.submit': 'Send request',
    'form.success': "Thank you! We've received your request and will get back to you as soon as possible.",
    'form.gdpr': 'Your data is used solely to handle your booking request and is never shared with third parties.',
    'form.gdprLink': 'See the privacy policy.',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.orForm': 'or fill in the form',

    'form.submitting': 'Sending…',
    'form.errorRequired': 'Please fill in all required fields.',
    'form.errorDates': 'The check-out date must be after the check-in date.',
    'form.errorNetwork': 'Something went wrong. Please try again or email us at carabeo26nerja@gmail.com.',

    // ── Availability calendar ──
    'calendar.loading': 'Loading availability…',
    'calendar.error': 'Could not load availability. Please try again later.',
    'calendar.notConfigured': 'Availability coming soon.',
    'months': ['January','February','March','April','May','June','July','August','September','October','November','December'],
    'weekdays': ['Mo','Tu','We','Th','Fr','Sa','Su'],

    // ── Footer (brief §12) ──
    'footer.registry': 'VFT/MA/53903 (Andalusia)',
    'footer.nationalRegistry': 'National registry ESFCTU…539038',
    'footer.copyright': '© Carabeo 26',
    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy',

    // ── Legal notice (legal.html) — [+] standard legal text, to validate ──
    'legal.title': 'Legal notice',
    'legal.holderTitle': 'Holder',
    'legal.holderBody': 'Owner: [to be completed by the holder] · Contact email: carabeo26nerja@gmail.com · Nerja (Málaga), Spain.',
    'legal.registryTitle': 'Registration details',
    'legal.registryBody': 'Tourist accommodation registered in the Andalusian Tourism Registry under number VFT/MA/53903. National registry: ESFCTU0000290130000579000000000000000000VFT/MA/539038.',
    'legal.useTitle': 'Terms of use',
    'legal.useBody': 'This website provides information about the Carabeo 26 accommodation and handles direct booking requests. Using the site implies acceptance of these terms.',
    'legal.lawTitle': 'Applicable law',
    'legal.lawBody': 'These terms are governed by Spanish law.',
    'legal.back': '← Back to home',

    // ── Privacy (privacy.html) — [+] standard GDPR text, to validate ──
    'privacy.title': 'Privacy policy',
    'privacy.responsibleTitle': 'Data controller',
    'privacy.responsibleBody': 'Controller: [to be completed by the holder]. Contact: carabeo26nerja@gmail.com.',
    'privacy.purposeTitle': 'Purpose',
    'privacy.purposeBody': 'We process the data you provide in the form (name, email, phone number, stay dates, number of guests and, optionally, your message) for the sole purpose of handling your direct booking request.',
    'privacy.legalTitle': 'Legal basis',
    'privacy.legalBody': 'Processing is based on your consent, given when you submit the request form.',
    'privacy.recipientsTitle': 'Recipients',
    'privacy.recipientsBody': 'Your data is not shared with third parties. It is stored in the Google services (Sheets/Gmail) used to receive and handle the request.',
    'privacy.retentionTitle': 'Data retention',
    'privacy.retentionBody': 'We keep the data for as long as needed to handle your request and, where applicable, your stay; afterwards it is deleted unless there is a legal obligation to retain it.',
    'privacy.rightsTitle': 'Your rights',
    'privacy.rightsBody': 'You may exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to carabeo26nerja@gmail.com. You may also lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).',
    'privacy.back': '← Back to home',
  }
}

// ─── Aplicar idioma ────────────────────────────────────────────────────────

function applyLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG
  const dict = DICT[lang]

  document.documentElement.lang = lang

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const txt = dict[el.getAttribute('data-i18n')]
    if (txt != null) el.textContent = txt
  })

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const txt = dict[el.getAttribute('data-i18n-placeholder')]
    if (txt != null) el.setAttribute('placeholder', txt)
  })

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const txt = dict[el.getAttribute('data-i18n-aria-label')]
    if (txt != null) el.setAttribute('aria-label', txt)
  })

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const txt = dict[el.getAttribute('data-i18n-alt')]
    if (txt != null) el.setAttribute('alt', txt)
  })

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang)
  })

  try { localStorage.setItem(STORAGE_KEY, lang) } catch (_) {}

  window.dispatchEvent(new CustomEvent('carabeo26:langchange', { detail: lang }))
}

// ─── Detección inicial: preferencia guardada → navigator.language → 'es' ────

function detectLang() {
  let saved = null
  try { saved = localStorage.getItem(STORAGE_KEY) } catch (_) {}
  if (saved && SUPPORTED.includes(saved)) return saved

  const nav = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase()
  return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG
}

// ─── Init ────────────────────────────────────────────────────────────────

let _currentLang = DEFAULT_LANG

document.addEventListener('DOMContentLoaded', () => {
  _currentLang = detectLang()
  applyLang(_currentLang)

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLang = btn.getAttribute('data-lang-btn')
      applyLang(_currentLang)
    })
  })
})

// ─── API pública — window.t(key) para uso desde main.js ──────────────────

window.t = function (key) {
  return (DICT[_currentLang] || DICT[DEFAULT_LANG])[key] || key
}
