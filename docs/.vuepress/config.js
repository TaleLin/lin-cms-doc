module.exports = {
  dest: 'lin',
  base:'/',
  locales: {
    '/': {
      keywords: 'lin cms,lin-cms, 林间有风, LIN',
      description:
        'Lin-CMS 是林间有风团队经过大量项目实践所提炼出的一套内容管理系统框架。Lin-CMS 可以有效的帮助开发者提高 CMS 的开发效率。'
    }
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: `/logo.png`
      }
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/manifest.json'
      }
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#3eaf7c'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: `/icons/apple-touch-icon-152x152.png`
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#3eaf7c'
      }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/msapplication-icon-144x144.png'
      }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileColor',
        content: '#000000'
      }
    ]
  ],
  serviceWorker: true,
  theme: '',
  themeConfig: {
    repo: '',
    logo: '/left-logo.png',
    editLinks: false,
    lastUpdated: '上次更新',
    docsDir: 'docs',
    locales: {
      '/': {
        nav: [
          {
            text: '介绍',
            link: '/'
          },
          {
            text: '慕课课程',
            link: '/lin/imooc/'
          },
          {
            text: '入门',
            link: '/lin/start/'
          },
          {
            text: '后端',
            link: '/lin/server/'
          },
          {
            text: '前端',
            link: '/lin/client/'
          },
          {
            text: 'API',
            link: '/lin/api/'
          },
          {
            text: '插件',
            link: '/lin/plugins/flask/'
          },
          {
            text: '版本日志',
            link: '/lin/update/'
          },
          {
            text: '专栏',
            link: 'https://course.7yue.pro/'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/TaleLin/lin-cms-vue'
          }
          // {
          //   text: '内部资料',
          //   link: '/lin/inside/'
          // },
          // {
          //   text: '文档规范',
          //   link: '/standard/'
          // }
        ],
        sidebar: {
          '/lin/introduce/': [
            {
              title: '指南',
              children: ['/lin/introduce/', 'imooc', 'update']
            }
          ],
          '/lin/start/': [
            {
              title: 'koa入门',
              children: [
                '/lin/start/koa/',
                'koa/vue-client',
                'koa/backend-demo',
                'koa/frontend-demo'
              ]
            },
            {
              title: 'flask入门',
              children: [
                '/lin/start/flask/',
                'flask/vue-client',
                'flask/backend-demo',
                'flask/frontend-demo'
              ]
            },
            {
              title: 'spring-boot入门',
              children: [
                '/lin/start/spring-boot/',
                'spring-boot/vue-client',
                'spring-boot/backend-demo',
                'spring-boot/frontend-demo'
              ]
            }
          ],
          '/lin/server/': [
            {
              title: 'koa',
              children: [
                '/lin/server/koa/',
                'koa/authority_model',
                'koa/logger',
                'koa/config',
                'koa/validator',
                'koa/token',
                'koa/file',
                'koa/logging',
                'koa/unit_test',
                'koa/questions'
              ]
            },
            {
              title: 'flask',
              children: [
                '/lin/server/flask/',
                'flask/run_process',
                'flask/authority_and_models',
                'flask/logger_and_notify',
                'flask/config',
                'flask/token',
                'flask/file',
                'flask/logging',
                'flask/unit_test',
                'flask/essay1',
                'flask/questions'
              ]
            },
            {
              title: 'spring-boot',
              children: [
                '/lin/server/spring-boot/',
                'spring-boot/permission',
                'spring-boot/logger',
                'spring-boot/file',
                'spring-boot/standard',
                'spring-boot/logging',
                'spring-boot/token',
                'spring-boot/extension',
                'spring-boot/structure',
                'spring-boot/websocket'
              ]
            }
          ],
          '/lin/client/': [
            {
              title: '前端核心',
              children: [
                '/lin/client/',
                'catalog',
                'router',
                'authority',
                'model',
                'exception',
                'global'
              ]
            },
            {
              title: '前端组件库',
              children: [
                '/lin/client/components/',
                // 'components/table',
                // 'components/button',
                'components/icon',
                'components/preview',
                'components/imgUpload',
                'components/multiple',
                'components/tinymce',
                'components/notify'
              ]
            }
          ],
          '/lin/plugins/': [
            {
              title: '插件koa版',
              children: [
                '/lin/plugins/koa/'
                // 'koa/start',
                // 'koa/fe_develop',
                // 'koa/be_develop',
                // 'koa/list',
              ]
            },
            {
              title: '插件flask版',
              children: [
                '/lin/plugins/flask/',
                'flask/start',
                'flask/fe_develop',
                'flask/be_develop',
                'flask/list'
              ]
            }
          ],
          '/lin/update/': [
            {
              title: '版本日志',
              children: ['/lin/update/', 'flask', 'spring-boot', 'frontend']
            }
          ]
          // '/lin/guide/': [{
          //   title: '指南（不完整，仅参考）',
          //   children: ['/lin/guide/', 'structure', 'best-practice']
          // }],
          // '/lin/inside/': [{
          //   title: '内部',
          //   children: [
          //     '/lin/inside/',
          //     'api',
          //     'jwt',
          //     'md_style',
          //     'sse',
          //     'plugin',
          //     'default_plugins'
          //   ]
          // }],
          // '/standard/': [{
          //   title: '文档规范',
          //   children: ['/standard/', 'directory-structure', 'component']
          // }]
        }
      }
    }
  }
};
