import Vue from 'vue';
import Vuex from 'vuex';

import { executions } from './executions.module';
import { groups } from './groups.module';
import { pointers } from './pointers.module';
import { users } from './users.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    executions,
    groups,
    pointers,
    users,
  },
});

export default store;
