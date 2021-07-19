import Vue from 'vue';

import SearchCard from './SearchCard';
import ExecutionTimeline from './ExecutionTimeline';
import Sidebar from './Sidebar';
import Layout from './Layout';

Vue.component('app-inbox-execution-timeline', ExecutionTimeline);
Vue.component('app-inbox-search-card', SearchCard);
Vue.component('app-inbox-sidebar', Sidebar);
Vue.component('app-inbox-layout', Layout);
