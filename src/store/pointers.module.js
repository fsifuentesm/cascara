import Vue from 'vue';
import { pointerService } from '../services/pointer.service';

const state = {
  allItems: {},
};

const actions = {
  getAllPointers({ commit }) {
    pointerService.getPointers()
      .then((items) => {
        commit('getAllPointersSuccess', items);
      });
  },

  getPointer({ commit }, identifier) {
    pointerService.getPointer(identifier)
      .then((pointer) => {
        commit('getPointerSuccess', {
          identifier,
          pointer,
        });
      });
  },
};

const mutations = {
  getAllPointersSuccess(ste, items) {
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

  getPointerSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      data: {
        identifier: payload.pointer.id,
        name: payload.pointer.name,
        startedAt: payload.pointer.started_at,
      },
      loading: false,
      errors: false,
    });
  },
};

export const pointers = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default pointers;
