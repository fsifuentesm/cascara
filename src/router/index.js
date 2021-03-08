import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        {
          name: 'inbox',
          path: 'inbox',
          component: Vue.component('app-inbox'),
        },
        {
          name: 'inbox-item',
          path: 'inbox/:id',
          component: Vue.component('inbox'),
        },
        {
          name: 'inbox-item-pid',
          path: 'inbox/:id/:pid',
          component: Vue.component('inbox'),
        },
        {
          name: 'processes',
          path: 'process',
          component: Vue.component('processes'),
        },
        {
          name: 'process',
          path: 'process/:id',
          component: Vue.component('processes'),
        },
        {
          name: 'task-redirect',
          path: 'task/:id',
          component: Vue.component('task-redirect'),
        },
        {
          name: 'default',
          path: '',
          redirect: 'inbox',
        },
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: Vue.component('sign-in'),
    },
  ],
});
