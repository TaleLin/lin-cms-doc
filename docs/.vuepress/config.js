const highlight = require('./public/js/highlight')

module.exports = {
  title:'Lin CMS',
  evergreen: false,
  host: 'localhost',
  port: 3000,
  base:'/lin-cms-doc/',
  dest:'./dist',
  head:[
    ['link',{
      rel:'icon',
      href:'/favicon.ico'
    }]
  ],
    plugins: [
    'vuepress-plugin-medium-zoom',
    ['vuepress-plugin-code-copy', {
      align:"bottom",
      color:"#3963bc",
      successText:"复制成功~"
    }]
  ],
  chainMarkdown (config) {
    config
      .options
      .highlight(highlight)
      .end()
  },
  themeConfig: {
    docsDir: 'docs',
    editLinks: true,
    smoothScroll: true,
    editLinkText: '纠正错误',
    repo: "TaleLin/lin-cms",
    docsRepo: "TaleLin/lin-cms-doc",
    logo: '/left-logo.png',
    lastUpdated: '上次更新',
    locales: {
      '/': {
        nav: [
          {
            text: '介绍',
            link: '/'
          },
          {
            text: '慕课课程',
            link: '/imooc/'
          },
          {
            text: '入门',
            link: '/start/'
          },
          {
            text: '后端',
            link: '/server/'
          },
          {
            text: '前端',
            link: '/client/'
          },
          {
            text: 'API',
            link: '/api/'
          },
          {
            text: '插件',
            link: '/plugins/flask/'
          },
          {
            text: '版本日志',
            link: '/update/'
          },
          {
            text: '专栏',
            link: 'https://course.talelin.com'
          }
          // {
          //   text: '内部资料',
          //   link: '/inside/'
          // },
          // {
          //   text: '文档规范',
          //   link: '/standard/'
          // }
        ],
        sidebar: {
          '/introduce/': [
            {
              title: '指南',
              children: ['/introduce/', 'imooc', 'update']
            }
          ],
          '/start/': [
            {
              title: 'koa入门',
              children: [
                '/start/koa/',
                'koa/vue-client',
                'koa/backend-demo',
                'koa/frontend-demo'
              ]
            },
            {
              title: 'flask入门',
              children: [
                '/start/flask/',
                'flask/vue-client',
                'flask/backend-demo',
                'flask/frontend-demo'
              ]
            },
            {
              title: 'spring-boot入门',
              children: [
                '/start/spring-boot/',
                'spring-boot/vue-client',
                'spring-boot/backend-demo',
                'spring-boot/frontend-demo'
              ]
            }
          ],
          '/server/': [
            {
              title: 'koa',
              children: [
                '/server/koa/',
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
                '/server/flask/',
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
                '/server/spring-boot/',
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
          '/client/': [
            {
              title: '前端核心',
              children: [
                '/client/',
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
                '/client/components/',
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
          '/plugins/': [
            {
              title: '插件koa版',
              children: [
                '/plugins/koa/'
                // 'koa/start',
                // 'koa/fe_develop',
                // 'koa/be_develop',
                // 'koa/list',
              ]
            },
            {
              title: '插件flask版',
              children: [
                '/plugins/flask/',
                'flask/start',
                'flask/fe_develop',
                'flask/be_develop',
                'flask/list'
              ]
            }
          ],
          '/update/': [
            {
              title: '版本日志',
              children: ['/update/', 'flask', 'spring-boot', 'frontend']
            }
          ]
          // '/guide/': [{
          //   title: '指南（不完整，仅参考）',
          //   children: ['/guide/', 'structure', 'best-practice']
          // }],
          // '/inside/': [{
          //   title: '内部',
          //   children: [
          //     '/inside/',
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
