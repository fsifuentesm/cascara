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
  },
];

export const dashboardRoutes = {
  routes,
};

export default dashboardRoutes;
