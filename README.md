# luis.cafe

Sitio personal construido con Astro, Tailwind CSS y shadcn/ui.

## ✨ Qué incluye

- Blog con MDX y soporte para contenido enriquecido
- Sección de "now" en tiempo real para música, juegos, libros y películas
- Páginas para artículos, temas, videojuegos y fotos
- RSS, sitemap y navegación fluida con view transitions

## 🛠️ Stack

- Astro 6
- Tailwind CSS 4
- shadcn/ui + Radix UI
- MDX + Expressive Code
- Lucide Icons
- Vercel con ISR

## 📁 Estructura rápida

- `src/content/blog/` → entradas del blog
- `src/content/projects/` → proyectos
- `src/content/fotos/` → fotos
- `src/pages/api/` → endpoints en tiempo real
- `src/components/` → UI y bloques del sitio

## ⚙️ Desarrollo

```bash
pnpm install
pnpm dev
```

## 🔐 Variables de entorno

Crea un archivo `.env` con:

```env
LASTFM_API_KEY=
LASTFM_USERNAME=
STEAM_ID=
STEAM_API_KEY=
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
GOODREADS_USER_ID=
LETTERBOXD_USER_ID
```

## ✅ Verificación

```bash
pnpm build
```

## 🫶 Créditos

Basado en el tema [astro-erudite](https://github.com/jktrn/astro-erudite).

## 📣 Licencia

[MIT](LICENSE)
