import { defineConfig, envField } from 'astro/config'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import rehypeExpressiveCode from 'rehype-expressive-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypeShiki from '@shikijs/rehype'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import tailwindcss from '@tailwindcss/vite'

import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://cafe.vercel.app',
  integrations: [mdx(), react(), sitemap(), icon()],
  output: 'static',
  adapter: vercel({
    imagesConfig: {
      sizes: [320, 640, 1280],
    },
    imageService: true,
    devImageService: 'sharp',
    isr: {
      exclude: [
        '/api/now-code',
        '/api/now-collection',
        '/api/now-gaming',
        '/api/now-listening',
        '/api/now-reading',
        '/api/now-watching',
      ],
    },
  }),
  image: {
    domains: ['avatars.githubusercontent.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    port: 1234,
    host: true,
  },

  devToolbar: {
    enabled: false,
  },

  env: {
    schema: {
      LASTFM_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      LASTFM_USERNAME: envField.string({
        context: 'server',
        access: 'secret',
      }),
      STEAM_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      STEAM_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      IGDB_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      IGDB_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      GOODREADS_USER_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      LETTERBOXD_USER_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noreferrer', 'noopener'],
        },
      ],
      rehypeHeadingIds,
      rehypeKatex,
      [
        rehypeExpressiveCode,
        {
          themes: ['github-light'],
          plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
          defaultProps: {
            wrap: true,
            collapseStyle: 'collapsible-auto',
            overridesByLang: {
              'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
                {
                  showLineNumbers: false,
                },
            },
          },
          styleOverrides: {
            codeFontSize: '0.75rem',
            borderColor: 'var(--border)',
            codeFontFamily: 'var(--font-mono)',
            codeBackground:
              'color-mix(in oklab, var(--muted) 25%, transparent)',
            frames: {
              editorActiveTabForeground: 'var(--muted-foreground)',
              editorActiveTabBackground:
                'color-mix(in oklab, var(--muted) 25%, transparent)',
              editorActiveTabIndicatorBottomColor: 'transparent',
              editorActiveTabIndicatorTopColor: 'transparent',
              editorTabBorderRadius: '0',
              editorTabBarBackground: 'transparent',
              editorTabBarBorderBottomColor: 'transparent',
              frameBoxShadowCssValue: 'none',
              terminalBackground:
                'color-mix(in oklab, var(--muted) 25%, transparent)',
              terminalTitlebarBackground: 'transparent',
              terminalTitlebarBorderBottomColor: 'transparent',
              terminalTitlebarForeground: 'var(--muted-foreground)',
            },
            lineNumbers: {
              foreground: 'var(--muted-foreground)',
            },
            uiFontFamily: 'var(--font-sans)',
          },
        },
      ],
      [
        rehypeShiki,
        {
          theme: 'github-light',
          inline: 'tailing-curly-colon',
        },
      ],
    ],
    remarkPlugins: [remarkMath, remarkEmoji],
  },
})
