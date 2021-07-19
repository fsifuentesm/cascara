import Vue from 'vue';

import Inbox from './Inbox';
import Processes from './Processes';
import dashboardViewMixin from './../mixins/DashboardViewMixin';

Vue.component(
  'app-inbox',
  Object.assign({}, Inbox, { mixins: [dashboardViewMixin] }),
);
Vue.component('app-processes', Processes);
