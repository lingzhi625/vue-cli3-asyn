import Router from 'vue-router'
// import zuhe from './src/views/zuhe.vue'
// import loadImg from './src/views/loadImg.vue'
export default new Router({
 mode: 'history',
 routes: [
    {
      path: '/',
        name: 'loadImg',
        component: () => import('./src/views/loadImg.vue'),
        // component: loadImg,
        meta: {
          title: 'loadImg'
     }
    },
    {
      path: '/zuhe',
        name: 'zuhe',
        // component: zuhe,
        component: () => import('./src/views/zuhe.vue'),
        meta: {
          title: 'zuhe'
     }
    }
  ]
})