import Vue from 'vue';
import { pointerService } from '../services/pointer.service';

const state = {
  allItems: {},
};

const actions = {
  getAllPointers({ commit }) {
    pointerService.getPointers()
      .then((items) => {
        commit(
          'getAllPointersSuccess',
          items.map(x => ({ identifier: x.id, name: x.node.name, startedAt: x.started_at })),
        );
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
    items.forEach((ptr) => {
      Vue.set(ste.allItems, ptr.identifier, {
        data: ptr,
        loading: false,
        errors: false,
      });
    });
  },

  getPointerSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      data: payload.pointer,
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
