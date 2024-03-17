import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kitbag Mapper | Simple and versatile mapping utility for Typescript",
  description: "A simple and versatile mapping utility for Typescript",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/kitbag-logo-circle.svg',
    siteTitle: 'Kitbag Mapper',
    
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/defining-profiles' },
      { text: 'API', link: '/api' }
    ],

    sidebar: {
      '/api/': [
        {
          text: 'packages',
          items: [
            { text: '@kitbag/mapper', link: '/api/modules/kitbag' },
          ],
        },
      ],
      '/': [
        {
          text: 'Introduction',
          items: [
            {
              text: 'Introduction',
              link: '/introduction',
            },
            {
              text: 'Getting Started',
              link: '/getting-started',
            },
          ],
        },
        {
          text: 'Guide',
          items: [
            {
              text: 'Defining Profiles',
              link: '/defining-profiles',
            },
            {
              text: 'Nesting Profiles',
              link: '/nesting-profiles',
            },
            {
              text: 'Loading Profiles',
              link: '/loading-profiles',
            },
            {
              text: 'Mapping an Array',
              link: '/mapping-arrays',
            },
            {
              text: 'Debugging',
              link: '/debugging',
            },
            {
              text: 'Notes',
              link: '/notes',
            },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kitbagjs/mapper' }
    ]
  }
})
