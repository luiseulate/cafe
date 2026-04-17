# astro-cafe

Sitio personal construido con [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/). Basado en el tema [astro-erudite](https://github.com/jktrn/astro-erudite).

---

## Tecnologías

| Categoría         | Tecnología                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Framework         | [Astro 6](https://astro.build/)                                                          |
| Estilos           | [Tailwind CSS 4](https://tailwindcss.com/)                                               |
| Componentes       | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)              |
| Contenido         | [MDX](https://mdxjs.com/)                                                                |
| Bloques de código | [Expressive Code](https://expressive-code.com/) + [Shiki](https://shiki.style/)          |
| Matemáticas       | [KaTeX](https://katex.org/)                                                              |
| Iconos            | [Lucide](https://lucide.dev/) vía [astro-icon](https://github.com/natemoo-re/astro-icon) |
| Despliegue        | [Vercel](https://vercel.com/) con ISR                                                    |

---

## Características

- **Blog con MDX** — soporte para componentes, $\LaTeX$, emojis, resaltado de sintaxis y secciones colapsables.
- **Subposts** — divide entradas largas en partes con navegación propia y tabla de contenidos lateral.
- **Temas/etiquetas** — categorización de posts con página de índice por etiqueta.
- **Sección "Log"** — widgets en tiempo real que muestran qué estás escuchando, jugando y leyendo.
- **Colección de videojuegos** — biblioteca de juegos de Nintendo Switch consultada vía IGDB.
- **Proyectos** — galería de proyectos con imagen, descripción, fechas y enlace externo.
- **RSS** — feed en `/rss.xml` generado automáticamente.
- **Sitemap** — generado automáticamente por `@astrojs/sitemap`.
- **View Transitions** — navegación fluida entre páginas con la API nativa de Astro.

---

## Páginas

| Ruta           | Descripción                                    |
| -------------- | ---------------------------------------------- |
| `/`            | Inicio con presentación, posts recientes y log |
| `/blog`        | Listado paginado de posts                      |
| `/blog/[id]`   | Entrada de blog individual                     |
| `/temas`       | Índice de etiquetas                            |
| `/temas/[id]`  | Posts filtrados por etiqueta                   |
| `/acerca`      | Página del autor                               |
| `/videojuegos` | Colección de videojuegos                       |
| `/colofon`     | Información sobre el sitio                     |
| `/rss.xml`     | Feed RSS                                       |
| `/404`         | Página de error personalizada                  |

---

## APIs internas

Las siguientes rutas se excluyen del ISR y se ejecutan en tiempo real:

| Ruta                  | Fuente    | Descripción                   |
| --------------------- | --------- | ----------------------------- |
| `/api/now-listening`  | Last.fm   | Última canción reproducida    |
| `/api/now-gaming`     | Steam     | Último juego jugado           |
| `/api/now-collection` | IGDB      | Colección de juegos de Switch |
| `/api/now-reading`    | Goodreads | Libro en progreso             |

---

## Contenido

### Blog posts

Añade entradas en `src/content/blog/` como archivos `.mdx` o `.md`:

```yml
---
title: 'Título del post'
description: 'Breve descripción del contenido.'
date: 2024-01-01
tags: ['etiqueta-uno', 'etiqueta-dos']
image: './banner.jpg'
authors: ['nombre-autor']
draft: false
---
```

| Campo         | Tipo         | Requerido |
| ------------- | ------------ | --------- |
| `title`       | `string`     | Sí        |
| `description` | `string`     | Sí        |
| `date`        | `YYYY-MM-DD` | Sí        |
| `order`       | `number`     | No        |
| `image`       | imagen local | No        |
| `tags`        | `string[]`   | No        |
| `authors`     | `string[]`   | No        |
| `draft`       | `boolean`    | No        |

#### Subposts

Para crear subposts (partes de una serie), coloca los archivos dentro de una carpeta con el mismo id del post padre:

```
src/content/blog/
  zelda/
    index.mdx      ← post padre
    historia.mdx   ← subpost
```

### Proyectos

Añade proyectos en `src/content/projects/` como archivos `.md`:

```yml
---
name: 'Nombre del proyecto'
description: 'Descripción breve.'
tags: ['Framework', 'Librería']
image: '/static/imagen.png'
link: 'https://example.com'
startDate: '2024-01-01'
endDate: '2024-06-01'
---
```

---

## Configuración

Edita [src/consts.ts](src/consts.ts) para ajustar los metadatos del sitio y los enlaces de navegación:

```ts
export const SITE: Site = {
  title: 'astro-cafe',
  description: '...',
  href: 'https://astro-cafe.vercel.app',
  author: 'nombre',
  avatar: 'https://...',
  birthday: new Date('1985-06-21'),
  locale: 'es-ES',
  featuredPostCount: 6,
  postsPerPage: 12,
}
```

### Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
LASTFM_API_KEY=
LASTFM_USERNAME=
STEAM_ID=
STEAM_API_KEY=
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
GOODREADS_USER_ID=
```

### Colores

Los colores se definen en [src/styles/global.css](src/styles/global.css) en formato [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) siguiendo las convenciones de shadcn/ui:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
}
```

---

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo en http://localhost:1234
pnpm dev

# Verificación de tipos + build
pnpm build

# Previsualizar el build
pnpm preview

# Formatear archivos con Prettier
pnpm prettier
```

---

## Licencia

[MIT](LICENSE)
