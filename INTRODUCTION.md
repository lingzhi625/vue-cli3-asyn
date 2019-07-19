### 测试懒加载和非懒加载项目打包之后的区别
1、懒加载
routes: [
    {
      path: '/',
        name: 'loadImg',
###     component: () => import('./src/views/loadImg.vue'),
        meta: {
          title: 'loadImg'
     }
    },
    {
      path: '/zuhe',
        name: 'zuhe',
###     component: () => import('./src/views/zuhe.vue'),
        meta: {
          title: 'zuhe'
     }
    }
  ]
  打包之后生成的文件：
  favicon.ico
  index.html
# css:app.68b576ea.css, chunk-592a01fa.a97c8990.css;
  img: idBack.50f2d4ce.png, idCamera.ccb3ed84.png, idFront.0d181073.png
# js: app.1334a0ef.js, chunk-2d224cdd.c2799ab1.js, chunk-592a01fa.3c93d7bd.js, chunk-vendors.895ea142.js

2、非懒加载
routes: [
    {
      path: '/',
        name: 'loadImg',
###     component: loadImg,
        meta: {
          title: 'loadImg'
     }
    },
    {
      path: '/zuhe',
        name: 'zuhe',
###     component: zuhe,
        meta: {
          title: 'zuhe'
     }
    }
  ]
  打包之后生成的文件
  favicon.ico
  index.html
# css:app.e8923879.css;
  img: idBack.50f2d4ce.png, idCamera.ccb3ed84.png, idFront.0d181073.png
# js: app.acd6a805.js, chunk-vendors.f57a7e59.js
