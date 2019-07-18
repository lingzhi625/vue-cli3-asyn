import Router from 'vue-router'
export default new Router({
 mode: 'history',
 routes: [
    {
      path: '/',
        name: 'loadImg',
        component: () => import('./src/views/loadImg.vue'),
        meta: {
          title: 'loadImg'
     }
    }
  ]
})