import Vue from 'vue';
import { userService } from '../services/user.service';

const state = {
  allItems: {},
};

const actions = {
  getUser({ commit }, identifier) {
    userService.getUser(identifier)
      .then((user) => {
        commit('getUserSuccess', {
          identifier,
          user,
        });
      });
  },

  getUserGroups({ commit }, identifier) {
    userService.getUserGroups(identifier)
      .then((groups) => {
        commit('getUserGroupsSuccess', {
          identifier,
          groups,
        });
      });
  },
};

const mutations = {
  getUserSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      identifier: payload.user.identifier,
      email: payload.user.email,
      fullname: payload.user.fullname,
    });
  },

  getUserGroupsSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      groups: payload.groups,
    });
  },
};

export const users = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default users;
