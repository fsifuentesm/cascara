import Vue from 'vue';
import Vuex from 'vuex';

import { users } from './users.module';
import { groups } from './groups.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    users,
    groups,
  },
});

export default store;
