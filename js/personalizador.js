(function(){
  const money = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  });

  function svgPlaceholder(title, bg, fg){
    const safeTitle = String(title || 'SIN RECREO').replace(/[<>&"']/g, '');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760">
        <rect width="600" height="760" fill="${bg}"/>
        <rect x="48" y="48" width="504" height="664" fill="none" stroke="${fg}" stroke-width="3" opacity=".55"/>
        <circle cx="300" cy="292" r="118" fill="none" stroke="${fg}" stroke-width="8" opacity=".7"/>
        <path d="M184 493 C234 442 278 430 300 355 C322 430 366 442 416 493" fill="none" stroke="${fg}" stroke-width="9" stroke-linecap="round" opacity=".8"/>
        <text x="300" y="118" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="700" fill="${fg}">SIN RECREO</text>
        <text x="300" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="4" fill="${fg}">${safeTitle}</text>
      </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  const PRODUCTOS_DEMO = [
    {
      id: 'demo-01',
      title: 'El libro abierto',
      capsule: 'Línea editorial',
      description: 'Una estampa sobria, conceptual y silenciosa.',
      image: svgPlaceholder('EL LIBRO', '#1a1a1b', '#faf9f6')
    },
    {
      id: 'demo-02',
      title: 'La clase invisible',
      capsule: 'Efemérides',
      description: 'Una pieza pensada como pequeño archivo textil.',
      image: svgPlaceholder('LA CLASE', '#b35c44', '#faf9f6')
    },
    {
      id: 'demo-03',
      title: 'Nota al margen',
      capsule: 'Cápsula general',
      description: 'Una imagen para llevar una conversación puesta.',
      image: svgPlaceholder('MARGEN', '#faf9f6', '#1a1a1b')
    }
  ];

  const PRECIOS_BASE = {
    femenino: {
      S: 31000,
      M: 31000,
      L: 31000,
      XL: 31000,
      '2XL': 31000,
      '3XL': 35000,
      '4XL': 35000
    },
    unisex: {
      S: 33000,
      M: 33000,
      L: 33000,
      XL: 33000,
      '2XL': 33000,
      '3XL': 35000,
      '4XL': 35000,
      '5XL': 37000
    }
  };

  const TALLES = {
    femenino: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    unisex: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  };

  const COLORES = [
    { id: 'negro', label: 'Negro', hex: '#111111', note: 'Clásica, profunda, editorial.' },
    { id: 'blanco', label: 'Blanco', hex: '#f7f5ef', note: 'Limpia, luminosa, de alto contraste.' },
    { id: 'hueso', label: 'Hueso', hex: '#e9dfcf', note: 'Cálida, suave, muy SIN RECREO.' }
  ];

  const TAMANOS_ESTAMPA = [
    { id: 'normal', label: 'Normal', extra: 0, note: 'Equilibrada para uso diario.', scale: 'normal' },
    { id: 'grande', label: 'Grande', extra: 500, note: 'Más presencia visual. Suma $500.', scale: 'grande' },
    { id: 'extra_grande', label: 'Extra grande', extra: 1000, note: 'Impacto máximo. Suma $1000.', scale: 'extra' }
  ];

  const ENVIOS = [
    { id: 'retiro', label: 'Retiro coordinado', note: 'Coordinamos punto/día de entrega.' },
    { id: 'pudo', label: 'Envío a locker PUDO', note: 'Ideal si querés retirar cuando puedas.' },
    { id: 'domicilio', label: 'Envío a domicilio', note: 'Luego completás los datos de entrega.' }
  ];

  const PAGOS = [
    { id: 'mercado_pago', label: 'Mercado Pago', note: 'Tarjeta, dinero en cuenta u otros medios disponibles.' },
    { id: 'transferencia', label: 'Transferencia / Cuenta DNI', note: 'Cuenta DNI puede tener reintegro según promoción vigente.' }
  ];

  const MODEL_IMAGES = {
    /*
      Cuando tengas fotos reales, reemplazá o sumá rutas.
      El sistema busca primero: corte + color + talle.

      Ejemplo:
      'femenino|negro|M': 'https://cdn.sinrecreo.com.ar/modelos/femenino-negro-m.webp',
      'unisex|hueso|XL': 'https://cdn.sinrecreo.com.ar/modelos/unisex-hueso-xl.webp'
    */
  };

  const state = {
    step: 0,
    estampa: null,
    corte: null,
    talle: null,
    color: null,
    tamano: null,
    envio: null,
    pago: null
  };

  const steps = [
    {
      key: 'estampa',
      eyebrow: 'Paso 1',
      title: 'Elegí una estampa del catálogo',
      help: 'Seleccioná la imagen que querés llevar en tu remera.'
    },
    {
      key: 'corte',
      eyebrow: 'Paso 2',
      title: 'Elegí el corte de la remera',
      help: 'Podés elegir corte femenino o unisex. Esto define los talles disponibles y el precio base.'
    },
    {
      key: 'talle',
      eyebrow: 'Paso 3',
      title: 'Elegí el talle',
      help: 'Los talles cambian según el corte. El precio se actualiza automáticamente.'
    },
    {
      key: 'color',
      eyebrow: 'Paso 4',
      title: 'Elegí el color de la remera',
      help: 'Negro, blanco o hueso. La vista previa se va acomodando a tu selección.'
    },
    {
      key: 'tamano',
      eyebrow: 'Paso 5',
      title: 'Elegí el tamaño de la estampa',
      help: 'Normal, grande o extra grande. Las opciones grandes suman diferencia al precio final.'
    },
    {
      key: 'envio',
      eyebrow: 'Paso 6',
      title: 'Elegí envío o retiro',
      help: 'Definí cómo querés recibir tu pedido. Después podés completar o confirmar los datos.'
    },
    {
      key: 'pago',
      eyebrow: 'Paso 7',
      title: 'Elegí la forma de pago',
      help: 'Seleccioná cómo querés pagar. Al finalizar, esto queda listo para enviar al carrito.'
    },
    {
      key: 'confirmacion',
      eyebrow: 'Resumen',
      title: 'Revisá tu remera personalizada',
      help: 'Si está todo bien, agregala al carrito o volvé atrás para cambiar algo.'
    }
  ];

  const modal = document.getElementById('srpModal');
  const optionsEl = document.getElementById('srpOptions');
  const counterEl = document.getElementById('srpStepCounter');
  const progressEl = document.getElementById('srpProgressBar');
  const eyebrowEl = document.getElementById('srpStepEyebrow');
  const titleEl = document.getElementById('srpStepTitle');
  const helpEl = document.getElementById('srpStepHelp');
  const backBtn = document.getElementById('srpBackBtn');
  const nextBtn = document.getElementById('srpNextBtn');
  const totalEl = document.getElementById('srpTotal');
  const priceNoteEl = document.getElementById('srpPriceNote');
  const summaryEl = document.getElementById('srpSelectedSummary');
  const previewTitleEl = document.getElementById('srpPreviewTitle');
  const previewMetaEl = document.getElementById('srpPreviewMeta');
  const fallbackShirt = document.getElementById('srpFallbackShirt');
  const printZone = document.getElementById('srpPrintZone');
  const printImage = document.getElementById('srpPrintImage');
  const printText = document.getElementById('srpPrintText');
  const modelImage = document.getElementById('srpModelImage');
  const fallbackModel = document.getElementById('srpFallbackModel');

  function getCatalog(){
    const raw = window.SR_CATALOG || window.PRODUCTS || window.products || PRODUCTOS_DEMO;

    return raw.map(function(p, index){
      return {
        id: p.id || p.slug || 'producto-' + index,
        title: p.title || p.name || p.nombre || 'Remera SIN RECREO',
        capsule: p.capsule || p.capsula || p.category || 'Catálogo',
        description: p.description || p.descripcion || '',
        image: p.image || p.image_url || p.cover || p.img || (Array.isArray(p.images) ? p.images[0] : '')
      };
    });
  }

  function normalizeProduct(product){
    if(!product) return null;

    return {
      id: product.id || product.slug || String(Date.now()),
      title: product.title || product.name || product.nombre || 'Remera SIN RECREO',
      capsule: product.capsule || product.capsula || product.category || 'Catálogo',
      description: product.description || product.descripcion || '',
      image: product.image || product.image_url || product.cover || product.img || (Array.isArray(product.images) ? product.images[0] : '')
    };
  }

  function reset(nextProduct){
    state.step = 0;
    state.estampa = normalizeProduct(nextProduct);
    state.corte = null;
    state.talle = null;
    state.color = null;
    state.tamano = null;
    state.envio = null;
    state.pago = null;

    if(state.estampa){
      state.step = 1;
    }
  }

  function open(product){
    reset(product);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    render();
  }

  function close(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  function isCurrentStepComplete(){
    const key = steps[state.step].key;
    if(key === 'confirmacion') return true;
    return Boolean(state[key]);
  }

  function selectValue(key, value){
    state[key] = value;

    if(key === 'corte'){
      state.talle = null;
    }

    render();
  }

  function goNext(){
    if(!isCurrentStepComplete()) return;

    if(steps[state.step].key === 'confirmacion'){
      finish();
      return;
    }

    state.step = Math.min(state.step + 1, steps.length - 1);
    render();
  }

  function goBack(){
    if(state.step === 0){
      close();
      return;
    }

    state.step = Math.max(state.step - 1, 0);
    render();
  }

  function getBasePrice(){
    if(!state.corte || !state.talle) return 0;
    return PRECIOS_BASE[state.corte]?.[state.talle] || 0;
  }

  function getPrintExtra(){
    return state.tamano?.extra || 0;
  }

  function getTotal(){
    return getBasePrice() + getPrintExtra();
  }

  function render(){
    const step = steps[state.step];

    counterEl.textContent = Math.min(state.step + 1, 7) + '/7';
    progressEl.style.width = Math.min(((state.step + 1) / 7) * 100, 100) + '%';
    eyebrowEl.textContent = step.eyebrow;
    titleEl.textContent = step.title;
    helpEl.textContent = step.help;

    optionsEl.className = 'srp-options';
    optionsEl.innerHTML = '';

    if(step.key === 'estampa') renderCatalogOptions();
    if(step.key === 'corte') renderCorteOptions();
    if(step.key === 'talle') renderTalleOptions();
    if(step.key === 'color') renderColorOptions();
    if(step.key === 'tamano') renderTamanoOptions();
    if(step.key === 'envio') renderEnvioOptions();
    if(step.key === 'pago') renderPagoOptions();
    if(step.key === 'confirmacion') renderConfirmacion();

    renderPreview();
    renderSummary();

    backBtn.textContent = state.step === 0 ? 'Cerrar' : 'Atrás';
    nextBtn.textContent = step.key === 'confirmacion' ? 'Agregar al carrito' : 'Siguiente';
    nextBtn.disabled = !isCurrentStepComplete();
  }

  function optionButton({selected, html, onClick}){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'srp-option' + (selected ? ' is-selected' : '');
    btn.innerHTML = html;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderCatalogOptions(){
    optionsEl.classList.add('is-catalog');

    getCatalog().forEach(function(product){
      const selected = state.estampa && state.estampa.id === product.id;

      optionsEl.appendChild(optionButton({
        selected,
        html: `
          <div class="srp-option-inner">
            <img class="srp-option-img" src="${escapeHTML(product.image || svgPlaceholder('SIN RECREO', '#1a1a1b', '#faf9f6'))}" alt="${escapeHTML(product.title)}">
            <div class="srp-option-copy">
              <strong>${escapeHTML(product.title)}</strong>
              <span>${escapeHTML(product.capsule || 'Catálogo')}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('estampa', product); }
      }));
    });
  }

  function renderCorteOptions(){
    [
      { id: 'femenino', label: 'Femenino', note: 'Calce más entallado. Talles S a 4XL.' },
      { id: 'unisex', label: 'Unisex', note: 'Calce clásico amplio. Talles S a 5XL.' }
    ].forEach(function(corte){
      optionsEl.appendChild(optionButton({
        selected: state.corte === corte.id,
        html: `
          <div class="srp-option-inner">
            <div class="srp-option-copy">
              <strong>${corte.label}</strong>
              <span>${corte.note}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('corte', corte.id); }
      }));
    });
  }

  function renderTalleOptions(){
    const talles = TALLES[state.corte] || [];

    if(!state.corte){
      optionsEl.innerHTML = '<div class="srp-finish-card"><h4>Primero elegí el corte</h4><p>Volvé al paso anterior para elegir femenino o unisex.</p></div>';
      return;
    }

    talles.forEach(function(talle){
      const price = PRECIOS_BASE[state.corte][talle];

      optionsEl.appendChild(optionButton({
        selected: state.talle === talle,
        html: `
          <div class="srp-option-inner">
            <div class="srp-option-copy">
              <strong>Talle ${talle}</strong>
              <span>${money.format(price)} · Corte ${state.corte}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('talle', talle); }
      }));
    });
  }

  function renderColorOptions(){
    COLORES.forEach(function(color){
      optionsEl.appendChild(optionButton({
        selected: state.color && state.color.id === color.id,
        html: `
          <div class="srp-option-inner">
            <span class="srp-option-color-dot" style="background:${color.hex}"></span>
            <div class="srp-option-copy">
              <strong>${color.label}</strong>
              <span>${color.note}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('color', color); }
      }));
    });
  }

  function renderTamanoOptions(){
    TAMANOS_ESTAMPA.forEach(function(tamano){
      optionsEl.appendChild(optionButton({
        selected: state.tamano && state.tamano.id === tamano.id,
        html: `
          <div class="srp-option-inner">
            <div class="srp-option-copy">
              <strong>${tamano.label}</strong>
              <span>${tamano.note}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('tamano', tamano); }
      }));
    });
  }

  function renderEnvioOptions(){
    ENVIOS.forEach(function(envio){
      optionsEl.appendChild(optionButton({
        selected: state.envio && state.envio.id === envio.id,
        html: `
          <div class="srp-option-inner">
            <div class="srp-option-copy">
              <strong>${envio.label}</strong>
              <span>${envio.note}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('envio', envio); }
      }));
    });
  }

  function renderPagoOptions(){
    PAGOS.forEach(function(pago){
      optionsEl.appendChild(optionButton({
        selected: state.pago && state.pago.id === pago.id,
        html: `
          <div class="srp-option-inner">
            <div class="srp-option-copy">
              <strong>${pago.label}</strong>
              <span>${pago.note}</span>
            </div>
          </div>
        `,
        onClick: function(){ selectValue('pago', pago); }
      }));
    });
  }

  function renderConfirmacion(){
    optionsEl.innerHTML = `
      <div class="srp-finish-card">
        <h4>Tu selección</h4>
        <ul class="srp-finish-list">
          <li><span>Estampa</span><strong>${escapeHTML(state.estampa?.title || '-')}</strong></li>
          <li><span>Corte</span><strong>${labelCorte(state.corte)}</strong></li>
          <li><span>Talle</span><strong>${escapeHTML(state.talle || '-')}</strong></li>
          <li><span>Color</span><strong>${escapeHTML(state.color?.label || '-')}</strong></li>
          <li><span>Tamaño de estampa</span><strong>${escapeHTML(state.tamano?.label || '-')}</strong></li>
          <li><span>Entrega</span><strong>${escapeHTML(state.envio?.label || '-')}</strong></li>
          <li><span>Pago</span><strong>${escapeHTML(state.pago?.label || '-')}</strong></li>
          <li><span>Total estimado</span><strong>${money.format(getTotal())}</strong></li>
        </ul>
      </div>
    `;
  }

  function renderPreview(){
    const shirtColor = state.color?.hex || '#111111';
    fallbackShirt.style.background = shirtColor;

    const isLight = state.color && ['blanco', 'hueso'].includes(state.color.id);
    printText.style.color = isLight ? '#1a1a1b' : '#faf9f6';
    printZone.style.borderColor = isLight ? 'rgba(26,26,27,.2)' : 'rgba(250,249,246,.26)';

    if(state.estampa?.image){
      printImage.src = state.estampa.image;
      printImage.hidden = false;
      printText.hidden = true;
    }else{
      printImage.hidden = true;
      printText.hidden = false;
    }

    const scale = state.tamano?.scale || 'normal';

    if(scale === 'normal'){
      printZone.style.width = '82px';
      printZone.style.height = '112px';
      printZone.style.top = '58px';
    }

    if(scale === 'grande'){
      printZone.style.width = '96px';
      printZone.style.height = '132px';
      printZone.style.top = '50px';
    }

    if(scale === 'extra'){
      printZone.style.width = '112px';
      printZone.style.height = '148px';
      printZone.style.top = '44px';
    }

    if(state.corte === 'femenino'){
      fallbackShirt.style.width = '152px';
      fallbackShirt.style.height = '206px';
    }else if(state.corte === 'unisex'){
      fallbackShirt.style.width = '178px';
      fallbackShirt.style.height = '214px';
    }else{
      fallbackShirt.style.width = '168px';
      fallbackShirt.style.height = '210px';
    }

    const modelKey = `${state.corte || ''}|${state.color?.id || ''}|${state.talle || ''}`;
    const modelSrc = MODEL_IMAGES[modelKey];

    if(modelSrc){
      modelImage.src = modelSrc;
      modelImage.hidden = false;
      fallbackModel.hidden = true;
    }else{
      modelImage.hidden = true;
      fallbackModel.hidden = false;
    }

    previewTitleEl.textContent = state.estampa?.title || 'Elegí una estampa';
    previewMetaEl.textContent = [
      labelCorte(state.corte),
      state.talle ? 'Talle ' + state.talle : null,
      state.color?.label,
      state.tamano?.label
    ].filter(Boolean).join(' · ') || 'Corte · Talle · Color · Estampa';

    const total = getTotal();
    totalEl.textContent = total ? money.format(total) : '$0';

    const base = getBasePrice();
    const extra = getPrintExtra();

    if(base && extra){
      priceNoteEl.textContent = `${money.format(base)} base + ${money.format(extra)} por tamaño de estampa.`;
    }else if(base){
      priceNoteEl.textContent = `${money.format(base)} según corte y talle.`;
    }else{
      priceNoteEl.textContent = 'El precio se actualiza con corte, talle y tamaño de estampa.';
    }
  }

  function renderSummary(){
    summaryEl.innerHTML = `
      <strong>Selección actual:</strong>
      ${escapeHTML(state.estampa?.title || 'Sin estampa')} ·
      ${labelCorte(state.corte) || 'Sin corte'} ·
      ${state.talle ? 'Talle ' + escapeHTML(state.talle) : 'Sin talle'} ·
      ${escapeHTML(state.color?.label || 'Sin color')} ·
      ${escapeHTML(state.tamano?.label || 'Sin tamaño')} ·
      ${escapeHTML(state.envio?.label || 'Sin entrega')} ·
      ${escapeHTML(state.pago?.label || 'Sin pago')}
    `;
  }

  function finish(){
    const item = {
      product_id: state.estampa.id,
      product_title: state.estampa.title,
      product_image: state.estampa.image,
      corte: state.corte,
      talle: state.talle,
      color: state.color.id,
      color_label: state.color.label,
      print_size: state.tamano.id,
      print_size_label: state.tamano.label,
      shipping_method: state.envio.id,
      shipping_label: state.envio.label,
      payment_method: state.pago.id,
      payment_label: state.pago.label,
      base_price: getBasePrice(),
      print_extra: getPrintExtra(),
      price: getTotal(),
      quantity: 1,
      source: 'personalizador_sin_recreo'
    };

    if(typeof window.SinRecreoPersonalizador.onComplete === 'function'){
      window.SinRecreoPersonalizador.onComplete(item);
    }else{
      console.log('SIN RECREO · item personalizado:', item);
      alert('Remera personalizada lista. Mirá la consola para ver el objeto del pedido.');
    }

    close();
  }

  function labelCorte(corte){
    if(corte === 'femenino') return 'Femenino';
    if(corte === 'unisex') return 'Unisex';
    return '';
  }

  function escapeHTML(value){
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  document.addEventListener('click', function(e){
    const openBtn = e.target.closest('[data-sr-open-personalizer]');

    if(openBtn){
      open();
      return;
    }

    if(e.target.closest('[data-srp-close]')){
      close();
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal.classList.contains('is-open')){
      close();
    }
  });

  backBtn.addEventListener('click', goBack);
  nextBtn.addEventListener('click', goNext);

  window.SinRecreoPersonalizador = {
    open,
    close,
    onComplete: null,
    getState: function(){
      return JSON.parse(JSON.stringify(state));
    }
  };
})();
