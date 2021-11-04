import Vue from 'vue';
import { executionService } from '../services/execution.service';
import { pointerService } from '../services/pointer.service';

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

  getExecutionPointers({ commit }, identifier) {
    pointerService.getPointers({ executionId: identifier })
      .then(({ items }) => {
        commit('getExecutionPointersSuccess', {
          identifier,
          pointers: items.map(x => x.id),
        });
        commit(
          'pointers/getAllPointersSuccess',
          items.map(x => ({
            identifier: x.id,
            name: x.node.name,
            startedAt: x.started_at,
            status: x.state,
          })),
          { root: true },
        );
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

  getExecutionPointersSuccess(ste, payload) {
    if (ste.allItems[payload.identifier]) {
      Vue.set(ste.allItems, payload.identifier, Object.assign(
        {
          ...ste.allItems[payload.identifier],
          data: {
            ...ste.allItems[payload.identifier].data,
            pointers: payload.pointers,
          },
          loading: false,
          errors: false,
        },
      ));
    } else {
      Vue.set(ste.allItems, payload.identifier, {
        data: {
          pointers: payload.pointers,
          identifier: payload.identifier,
        },
        loading: false,
        errors: false,
      });
    }
  },
};

export const executions = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default executions;
