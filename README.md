# SIN RECREO · Personalizador de remeras

ZIP listo para subir a GitHub Pages.

## Archivos

- `index.html`: página demo completa.
- `css/personalizador.css`: estilos del sitio demo y del modal.
- `js/personalizador.js`: lógica del personalizador.

## Cómo usar

Subí todo el contenido de esta carpeta a un repositorio de GitHub y activá GitHub Pages.

## Cómo abrir el modal

Cualquier botón con este atributo abre el personalizador:

```html
<button data-sr-open-personalizer>Personalizar remera</button>
```

También se puede abrir desde JavaScript:

```js
window.SinRecreoPersonalizador.open();
```

O desde un producto específico:

```js
window.SinRecreoPersonalizador.open({
  id: 'remera-001',
  title: 'El libro abierto',
  capsule: 'Línea editorial',
  image: 'https://cdn.sinrecreo.com.ar/productos/el-libro/1.webp'
});
```

## Cómo conectar con carrito real

En `index.html` hay este bloque:

```js
window.SinRecreoPersonalizador.onComplete = function(item){
  console.log(item);
};
```

Ahí llega el pedido completo:

```js
{
  product_id,
  product_title,
  product_image,
  corte,
  talle,
  color,
  color_label,
  print_size,
  print_size_label,
  shipping_method,
  shipping_label,
  payment_method,
  payment_label,
  base_price,
  print_extra,
  price,
  quantity,
  source
}
```

## Catálogo real

El personalizador busca productos en este orden:

1. `window.SR_CATALOG`
2. `window.PRODUCTS`
3. `window.products`
4. catálogo demo interno

Ejemplo:

```html
<script>
window.SR_CATALOG = [
  {
    id: 'gelman-01',
    title: 'Juan Gelman',
    capsule: 'Efemérides',
    image: 'https://cdn.sinrecreo.com.ar/productos/gelman/1.webp'
  }
];
</script>
```

Importante: ese script debe cargarse antes de `js/personalizador.js`.

## Fotos reales de modelos

En `js/personalizador.js`, buscá:

```js
const MODEL_IMAGES = {};
```

Y agregá rutas por corte, color y talle:

```js
const MODEL_IMAGES = {
  'femenino|negro|M': 'https://cdn.sinrecreo.com.ar/modelos/femenino-negro-m.webp',
  'unisex|hueso|XL': 'https://cdn.sinrecreo.com.ar/modelos/unisex-hueso-xl.webp'
};
```

Si no hay foto real para esa combinación, aparece una maqueta visual generada por CSS.
