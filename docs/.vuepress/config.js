import { defaultTheme, defineUserConfig } from 'vuepress';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Quick Vector Editor',
  description: '这是关于Quick Vector Editor的使用说明',
  theme: defaultTheme({
    navbar: [
      { text: 'GitHub', link: 'https://github.com/huifer/quick-vector' },
      { text: '关于我', link: 'https://github.com/huifer' },
    ],
    sidebar: [
      {
        text: '配置',
        children: ['config/配置文件.md'],
      },
      {
        text: '成图',
        children: [''],
      },
    ],
  }),
});
