import Vue from 'vue';

import { availableRoutes } from './dashboard.constants';

export const routes = [
  {
    name: 'dashboard',
    path: 'dashboard',
    component: Vue.component('app-inbox'),
    props: {
      routeDefinitions: availableRoutes,
    },
    beforeEnter(to, from, next) {
      if (!availableRoutes.map(x => x.feed).includes(to.query.feed)) {
        next({
          name: 'dashboard',
          query: Object.assign(
            {},
            to.query,
            { feed: availableRoutes[0].feed },
          ),
        });
      } else {
        next();
      }
    },
  },
];

export const dashboardRoutes = {
  routes,
};

export default dashboardRoutes;
