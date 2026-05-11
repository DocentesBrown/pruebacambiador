/* =============================================
   SIN RECREO — Personalizador de Remeras
   personalizador.js
   ============================================= */

/* ==========================================
   DATOS — Editá estos arrays para personalizar
   el catálogo con tu info real
   ========================================== */

const STAMPS = [
  { emoji: '🌙', name: 'Luna llena',  cat: 'Astral'   },
  { emoji: '🔥', name: 'Fuego',       cat: 'Energía'  },
  { emoji: '🌊', name: 'Ola',         cat: 'Natura'   },
  { emoji: '⚡', name: 'Rayo',        cat: 'Fuerza'   },
  { emoji: '🌿', name: 'Hoja',        cat: 'Natura'   },
  { emoji: '🌀', name: 'Espiral',     cat: 'Mística'  },
  { emoji: '🦋', name: 'Mariposa',    cat: 'Libertad' },
  { emoji: '✨', name: 'Brillo',      cat: 'Magia'    },
  { emoji: '🐍', name: 'Serpiente',   cat: 'Instinto' },
];

const CORTES = [
  { emoji: '👗', name: 'Femenino', sub: 'Entrada entallada, cuello V' },
  { emoji: '👕', name: 'Unisex',   sub: 'Recto, cuello redondo'       },
];

const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Negro',  hex: '#1a1a1a' },
  { name: 'Blanco', hex: '#f0ece4' },
  { name: 'Gris',   hex: '#787878' },
  { name: 'Rojo',   hex: '#c0392b' },
  { name: 'Verde',  hex: '#2c7a4b' },
  { name: 'Azul',   hex: '#1d4e89' },
  { name: 'Rosa',   hex: '#d4688e' },
  { name: 'Arena',  hex: '#c9a96e' },
];

const SIZES = [
  { icon: '◾', name: 'Pequeño', sub: 'Centrado al pecho\n~8×8 cm'    },
  { icon: '◼', name: 'Mediano', sub: 'Centrado al pecho\n~15×15 cm'  },
  { icon: '⬛', name: 'Grande',  sub: 'Pecho completo\n~22×22 cm'    },
];

const ENVIOS = [
  { icon: '🏠', name: 'Retiro en local',    desc: 'Av. Corrientes 1234, CABA · Lun–Sáb 11–20 h', free: true              },
  { icon: '📦', name: 'Envío a domicilio',  desc: 'Correo Argentino · 3–7 días hábiles',           price: '$2.500'        },
  { icon: '⚡', name: 'Envío express',      desc: 'Moto mensajería · Mismo día CABA',              price: '$4.200'        },
];

const PAGOS = [
  { icon: '💳', name: 'Tarjeta de crédito', desc: 'Visa, Mastercard, Amex · Hasta 6 cuotas sin interés' },
  { icon: '🏦', name: 'Transferencia',      desc: 'Banco / CVU · 5% de descuento'                       },
  { icon: '📱', name: 'Mercado Pago',       desc: 'Saldo, QR, tarjeta o en efectivo'                    },
  { icon: '💵', name: 'Efectivo en local',  desc: 'Solo para retiro presencial'                          },
];

/* ==========================================
   ESTADO
   ========================================== */

const sel = {
  stamp:  null,
  corte:  null,
  talle:  null,
  color:  null,
  size:   null,
  envio:  null,
  pago:   null,
};

let currentStep = 1;
const TOTAL_STEPS = 7;

/* ==========================================
   DOTS / NAVEGACIÓN
   ========================================== */

function buildDots() {
  const container = document.getElementById('dots');
  container.innerHTML = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('div');
    dot.className = 'sr-dot';
    if (i === currentStep)    dot.classList.add('active');
    else if (i < currentStep) dot.classList.add('done');
    container.appendChild(dot);
  }
}

function showStep(n) {
  document.querySelectorAll('.sr-step').forEach(s => s.classList.remove('visible'));
  const el = document.getElementById('step' + n);
  if (el) el.classList.add('visible');
  buildDots();
  updateFooter();
}

function canProceed() {
  if (currentStep === 1) return sel.stamp  !== null;
  if (currentStep === 2) return sel.corte  !== null;
  if (currentStep === 3) return sel.talle  !== null;
  if (currentStep === 4) return sel.color  !== null;
  if (currentStep === 5) return sel.size   !== null;
  if (currentStep === 6) return sel.envio  !== null;
  if (currentStep === 7) return sel.pago   !== null;
  return true;
}

function updateFooter() {
  const nb = document.getElementById('btnNext');
  const bb = document.getElementById('btnBack');

  document.getElementById('stepCounter').textContent =
    currentStep <= TOTAL_STEPS ? `PASO ${currentStep} DE ${TOTAL_STEPS}` : 'RESUMEN';

  nb.disabled = !canProceed();

  if (currentStep === TOTAL_STEPS) {
    nb.textContent = '¡Confirmar! →';
  } else if (currentStep > TOTAL_STEPS) {
    nb.style.display = 'none';
    bb.textContent = '← Modificar';
  } else {
    nb.textContent = 'Siguiente →';
    nb.style.display = '';
  }

  bb.style.display = currentStep === 1 ? 'none' : '';
}

function goNext() {
  if (!canProceed()) return;
  if (currentStep === TOTAL_STEPS) {
    currentStep = TOTAL_STEPS + 1;
    const code = 'SR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('orderCode').textContent = code;
    showStep(8);
    return;
  }
  currentStep++;
  showStep(currentStep);
}

function goBack() {
  if (currentStep > TOTAL_STEPS + 1) return;
  if (currentStep === TOTAL_STEPS + 1) {
    currentStep = TOTAL_STEPS;
  } else {
    currentStep--;
  }
  showStep(currentStep);
}

/* ==========================================
   PREVIEW EN VIVO
   ========================================== */

function updatePreview() {
  const shirtPath = document.getElementById('shirt-path');
  if (sel.color !== null) {
    shirtPath.setAttribute('fill', COLORS[sel.color].hex);
  }

  const stampPreview = document.getElementById('stampPreview');
  const stampEmoji   = document.getElementById('stampEmoji');

  if (sel.stamp !== null) {
    stampEmoji.textContent = STAMPS[sel.stamp].emoji;
    stampPreview.style.display = 'flex';
    stampPreview.className = 'sr-stamp-preview' +
      (sel.size === 0 ? ' sm' : sel.size === 2 ? ' lg' : '');
  } else {
    stampPreview.style.display = 'none';
  }

  buildSummary();
}

function buildSummary() {
  const summaryEl = document.getElementById('summary');
  let rows = '';
  if (sel.stamp  !== null) rows += row('Estampa', STAMPS[sel.stamp].name);
  if (sel.corte  !== null) rows += row('Corte',   CORTES[sel.corte].name);
  if (sel.talle  !== null) rows += row('Talle',   TALLES[sel.talle]);
  if (sel.color  !== null) rows += row('Color',   COLORS[sel.color].name);
  if (sel.size   !== null) rows += row('Tamaño',  SIZES[sel.size].name);
  if (sel.envio  !== null) rows += row('Envío',   ENVIOS[sel.envio].name);
  summaryEl.innerHTML = rows;
}

function row(label, value) {
  return `<div class="sr-sum-row"><span>${label}</span><span>${value}</span></div>`;
}

/* ==========================================
   TABLA DE TALLES
   ========================================== */

function toggleTabla() {
  const t = document.getElementById('tabla');
  t.style.display = t.style.display === 'none' ? 'block' : 'none';
}

/* ==========================================
   BUILDERS — Paso 1: Estampas
   ========================================== */

function buildStamps() {
  const grid = document.getElementById('stamps-grid');
  grid.innerHTML = '';
  STAMPS.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'sr-card' + (sel.stamp === i ? ' selected' : '');
    card.innerHTML = `
      <span class="sr-card-emoji">${s.emoji}</span>
      <span class="sr-card-label">${s.name}</span>
      <span class="sr-card-sub">${s.cat}</span>`;
    card.onclick = () => { sel.stamp = i; buildStamps(); updatePreview(); updateFooter(); };
    grid.appendChild(card);
  });
}

/* ---- Paso 2: Corte ---- */
function buildCorte() {
  const grid = document.getElementById('corte-grid');
  grid.innerHTML = '';
  CORTES.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'sr-card' + (sel.corte === i ? ' selected' : '');
    card.style.padding = '1.25rem .5rem';
    card.innerHTML = `
      <span class="sr-card-emoji" style="font-size:40px">${c.emoji}</span>
      <span class="sr-card-label" style="font-size:14px">${c.name}</span>
      <span class="sr-card-sub">${c.sub}</span>`;
    card.onclick = () => { sel.corte = i; buildCorte(); updatePreview(); updateFooter(); };
    grid.appendChild(card);
  });
}

/* ---- Paso 3: Talle ---- */
function buildTalle() {
  const grid = document.getElementById('talle-grid');
  grid.innerHTML = '';
  TALLES.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'sr-talle' + (sel.talle === i ? ' selected' : '');
    el.textContent = t;
    el.onclick = () => { sel.talle = i; buildTalle(); updatePreview(); updateFooter(); };
    grid.appendChild(el);
  });
}

/* ---- Paso 4: Color ---- */
function buildColors() {
  const grid = document.getElementById('color-grid');
  grid.innerHTML = '';
  COLORS.forEach((c, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'sr-color-item';

    const dot = document.createElement('div');
    dot.className = 'sr-color-dot' + (sel.color === i ? ' selected' : '');
    dot.style.background = c.hex;
    if (c.hex === '#f0ece4') dot.style.border = '2px solid rgba(245,240,232,0.4)';

    const label = document.createElement('span');
    label.className = 'sr-color-name';
    label.textContent = c.name;

    wrap.onclick = () => { sel.color = i; buildColors(); updatePreview(); updateFooter(); };
    wrap.appendChild(dot);
    wrap.appendChild(label);
    grid.appendChild(wrap);
  });
}

/* ---- Paso 5: Tamaño estampa ---- */
function buildSizes() {
  const grid = document.getElementById('size-grid');
  grid.innerHTML = '';
  SIZES.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'sr-size-card' + (sel.size === i ? ' selected' : '');
    card.innerHTML = `
      <span style="font-size:${18 + i * 10}px">${s.icon}</span>
      <span class="sr-size-label">${s.name}</span>
      <span class="sr-size-sub">${s.sub.replace('\n', '<br>')}</span>`;
    card.onclick = () => { sel.size = i; buildSizes(); updatePreview(); updateFooter(); };
    grid.appendChild(card);
  });
}

/* ---- Paso 6: Envío ---- */
function buildEnvio() {
  const grid = document.getElementById('envio-grid');
  grid.innerHTML = '';
  ENVIOS.forEach((e, i) => {
    const item = document.createElement('div');
    item.className = 'sr-pago-item' + (sel.envio === i ? ' selected' : '');
    const price = e.free
      ? `<span style="color:var(--sr-accent);font-size:11px;font-weight:600">GRATIS</span>`
      : `<span style="color:var(--sr-muted);font-size:11px">${e.price}</span>`;
    item.innerHTML = `
      <span class="sr-pago-icon">${e.icon}</span>
      <div class="sr-pago-info">
        <div class="sr-pago-name">${e.name} ${price}</div>
        <div class="sr-pago-desc">${e.desc}</div>
      </div>
      <span class="sr-pago-check">✓</span>`;
    item.onclick = () => { sel.envio = i; buildEnvio(); updateFooter(); };
    grid.appendChild(item);
  });
}

/* ---- Paso 7: Pago ---- */
function buildPago() {
  const grid = document.getElementById('pago-grid');
  grid.innerHTML = '';
  PAGOS.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'sr-pago-item' + (sel.pago === i ? ' selected' : '');
    item.innerHTML = `
      <span class="sr-pago-icon">${p.icon}</span>
      <div class="sr-pago-info">
        <div class="sr-pago-name">${p.name}</div>
        <div class="sr-pago-desc">${p.desc}</div>
      </div>
      <span class="sr-pago-check">✓</span>`;
    item.onclick = () => { sel.pago = i; buildPago(); updateFooter(); };
    grid.appendChild(item);
  });
}

/* ==========================================
   CARRITO
   ========================================== */

function addToCart() {
  const btn = document.querySelector('#step8 .sr-btn-next');
  btn.textContent = '¡En el carrito! ✓';
  btn.style.background = '#2c7a4b';
  btn.disabled = true;

  /*
    INTEGRACIÓN CON TU TIENDA:
    Aquí podés disparar un evento personalizado, hacer un fetch
    a tu backend, o llamar a la API de tu plataforma de e-commerce.

    Ejemplo con fetch:
    fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stamp:  STAMPS[sel.stamp],
        corte:  CORTES[sel.corte],
        talle:  TALLES[sel.talle],
        color:  COLORS[sel.color],
        size:   SIZES[sel.size],
        envio:  ENVIOS[sel.envio],
        pago:   PAGOS[sel.pago],
        code:   document.getElementById('orderCode').textContent,
      })
    });

    Ejemplo con evento personalizado (para escuchar desde tu página):
    window.parent.dispatchEvent(new CustomEvent('srAddToCart', { detail: { ...sel } }));
  */
}

/* ==========================================
   INIT
   ========================================== */

buildStamps();
buildCorte();
buildTalle();
buildColors();
buildSizes();
buildEnvio();
buildPago();
showStep(1);
updatePreview();
