import Vue from 'vue';
import { groupService } from '../services/group.service';

const state = {
  allItems: {},
};

const actions = {
  getAllGroups({ commit }) {
    groupService.getGroups()
      .then((items) => {
        commit('getAllGroupsSuccess', items);
      });
  },

  getGroup({ commit }, identifier) {
    groupService.getGroup(identifier)
      .then((group) => {
        commit('getGroupSuccess', {
          identifier,
          group,
        });
      });
  },
};

const mutations = {
  getAllGroupsSuccess(ste, items) {
    items.forEach((x) => {
      Vue.set(ste.allItems, x.codename, {
        data: {
          identifier: x.identifier,
          name: x.name,
        },
        loading: false,
        errors: false,
      });
    });
  },

  getGroupSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      data: {
        identifier: payload.group.identifier,
        name: payload.group.name,
      },
      loading: false,
      errors: false,
    });
  },
};

export const groups = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default groups;
