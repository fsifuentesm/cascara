import Vue from 'vue';

import { availableRoutes, baseSearchForm } from './dashboard.constants';

export const routes = [
  {
    name: 'dashboard',
    path: 'dashboard',
    component: Vue.component('app-inbox'),
    props: {
      routeDefinitions: availableRoutes,
      defaultForm: baseSearchForm,
    },
  },
];

export const dashboardRoutes = {
  routes,
};

export default dashboardRoutes;
