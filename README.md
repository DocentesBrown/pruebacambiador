# SIN RECREO — Personalizador de Remeras

Modal interactivo de 7 pasos para personalizar remeras, listo para integrar en cualquier sitio web.

---

## Archivos

```
sinrecro-personalizador/
├── index.html           ← Página demo con el botón que abre el modal
├── personalizador.html  ← El personalizador (se carga como iframe)
├── personalizador.css   ← Estilos
├── personalizador.js    ← Lógica y datos del catálogo
└── README.md
```

---

## Cómo integrar en tu página existente

### 1. Copiá los archivos

Subí `personalizador.html`, `personalizador.css` y `personalizador.js` a la raíz de tu proyecto (o en una carpeta, ajustando las rutas).

### 2. Agregá el HTML del modal a tu página

```html
<!-- Botón para abrir -->
<button onclick="openPersonalizador()">PERSONALIZÁ TU REMERA</button>

<!-- Overlay -->
<div id="srModalOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;align-items:center;justify-content:center;padding:1rem;">
  <div style="position:relative;width:100%;max-width:820px">
    <button onclick="closePersonalizador()" style="position:absolute;top:-36px;right:0;background:none;border:none;color:#f5f0e8;font-size:14px;cursor:pointer">✕ cerrar</button>
    <iframe id="srIframe" src="" style="width:100%;height:700px;border:none;display:block;"></iframe>
  </div>
</div>
```

### 3. Agregá el JS de control

```html
<script>
  function openPersonalizador() {
    const iframe = document.getElementById('srIframe');
    if (!iframe.src || iframe.src === window.location.href) {
      iframe.src = 'personalizador.html'; // ajustá la ruta si es necesario
    }
    const overlay = document.getElementById('srModalOverlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePersonalizador() {
    document.getElementById('srModalOverlay').style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePersonalizador();
  });
</script>
```

---

## Personalizar el catálogo

Todo el contenido editable está al principio de `personalizador.js`, en los arrays con mayúsculas:

```js
// Cambiá los emojis por imágenes <img> si tenés diseños propios
const STAMPS = [
  { emoji: '🌙', name: 'Luna llena', cat: 'Astral' },
  // ...
];

const COLORS = [
  { name: 'Negro', hex: '#1a1a1a' },
  // ...
];

const ENVIOS = [
  { icon: '🏠', name: 'Retiro en local', desc: 'Tu dirección · Horario', free: true },
  // ...
];
```

---

## Integrar con tu carrito / backend

En `personalizador.js`, al final de la función `addToCart()`, encontrás el bloque de integración comentado:

```js
// Opción A — fetch a tu API
fetch('/api/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...sel, code })
});

// Opción B — evento para escuchar desde la página padre
window.parent.dispatchEvent(new CustomEvent('srAddToCart', { detail: { ...sel } }));
```

---

## Usar imágenes reales en vez de emojis

Para usar imágenes propias como estampas, reemplazá el campo `emoji` por una URL y modificá el builder en `personalizador.js`:

```js
// En STAMPS:
{ img: '/img/estampas/luna.png', name: 'Luna llena', cat: 'Astral' }

// En buildStamps(), cambiá:
card.innerHTML = `<img src="${s.img}" style="width:40px;height:40px;object-fit:contain">...`
```

---

## Requisitos

- Ninguno. HTML + CSS + JS vanilla, sin dependencias.
- Funciona en todos los navegadores modernos.
- Las fuentes se cargan desde Google Fonts (requiere conexión).
