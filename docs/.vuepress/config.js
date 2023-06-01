import { defaultTheme, defineUserConfig } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { nprogressPlugin } from '@vuepress/plugin-nprogress';

export default defineUserConfig({
  markdown: { lineNumbers: true },
  lang: 'zh-CN',
  title: 'Quick Vector Editor',
  description: '这是关于Quick Vector Editor的使用说明',
  plugins: [
    nprogressPlugin(),
    mediumZoomPlugin({
      // 配置项
    }),
    prismjsPlugin({
      preloadLanguages: ['markdown', 'jsdoc', 'yaml', 'java', 'javascript', 'json'],
    }),
    searchPlugin({}),
  ],
  theme: defaultTheme({
    docsRepo: 'https://github.com/huifer/quick-vector',
    docsBranch: 'develop',
    docsDir: 'docs',
    editLinkPattern: ':repo/tree/:branch/:path',
    navbar: [
      { text: 'GitHub', link: 'https://github.com/huifer/quick-vector' },
      { text: '关于我', link: 'https://github.com/huifer' },
    ],
    editLink: true,
    sidebar: [
      {
        text: '配置',
        children: [
          {
            text: '文件说明',
            link: '/config/文件说明.md',
          },
        ],
      },
      {
        text: '成图',
        children: [
          {
            text: 'csv成图',
            link: '/成图/csv成图.md',
          },
        ],
      },
    ],
  }),
});
