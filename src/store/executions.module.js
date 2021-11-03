import Vue from 'vue';
import { executionService } from '../services/execution.service';

const state = {
  allItems: {},
};

const actions = {
  getAllExecutions({ commit }) {
    executionService.getExecutions()
      .then((items) => {
        commit('getAllExecutionsSuccess', items);
      });
  },

  getExecution({ commit }, identifier) {
    executionService.getExecution(identifier)
      .then((execution) => {
        commit('getExecutionSuccess', {
          identifier,
          execution,
        });
      });
  },
};

const mutations = {
  getAllExecutionsSuccess(ste, items) {
    items.forEach((x) => {
      Vue.set(ste.allItems, x.identifier, {
        data: {
          identifier: x.id,
          name: x.name,
          startedAt: x.started_at,
        },
        loading: false,
        errors: false,
      });
    });
  },

  getExecutionSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      data: {
        identifier: payload.execution.id,
        name: payload.execution.name,
        startedAt: payload.execution.started_at,
      },
      loading: false,
      errors: false,
    });
  },
};

export const executions = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default executions;
