import Vue from 'vue';
import { userService } from '../services/user.service';
import { pointerService } from '../services/pointer.service';

const state = {
  allItems: {},
};

const actions = {
  getAllUsers({ commit }) {
    userService.getUsers()
      .then((items) => {
        commit('getAllUsersSuccess', items);
      });
  },

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

  getUserPointers({ commit }, identifier) {
    pointerService.getPointers({
      actoredUsers: [identifier],
      notifiedUsers: [identifier],
    })
      .then(({ items }) => {
        commit('getUserPointersSuccess', {
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

  getUserPermissions({ commit }, identifier) {
    userService.getUserPermissions(identifier)
      .then((permissions) => {
        commit('getUserPermissionsSuccess', {
          identifier,
          permissions,
        });
      });
  },
};

const mutations = {
  getAllUsersSuccess(ste, items) {
    items.forEach((x) => {
      Vue.set(ste.allItems, x.identifier, {
        data: {
          identifier: x.identifier,
          email: x.email,
          fullname: x.fullname,
        },
        loading: false,
        errors: false,
      });
    });
  },

  getUserSuccess(ste, payload) {
    Vue.set(ste.allItems, payload.identifier, {
      data: {
        identifier: payload.user.identifier,
        email: payload.user.email,
        fullname: payload.user.fullname,
      },
      loading: false,
      errors: false,
    });
  },

  getUserGroupsSuccess(ste, payload) {
    if (ste.allItems[payload.identifier]) {
      Vue.set(ste.allItems, payload.identifier, Object.assign(
        {
          ...ste.allItems[payload.identifier],
          data: {
            ...ste.allItems[payload.identifier].data,
            groups: payload.groups,
          },
          loading: false,
          errors: false,
        },
      ));
    } else {
      Vue.set(ste.allItems, payload.identifier, {
        data: {
          groups: payload.groups,
          identifier: payload.identifier,
        },
        loading: false,
        errors: false,
      });
    }
  },

  getUserPointersSuccess(ste, payload) {
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

  getUserPermissionsSuccess(ste, payload) {
    if (ste.allItems[payload.identifier]) {
      Vue.set(ste.allItems, payload.identifier, Object.assign(
        {
          ...ste.allItems[payload.identifier],
          data: {
            ...ste.allItems[payload.identifier].data,
            permissions: payload.permissions,
          },
          loading: false,
          errors: false,
        },
      ));
    } else {
      Vue.set(ste.allItems, payload.identifier, {
        data: {
          permissions: payload.permissions,
          identifier: payload.identifier,
        },
        loading: false,
        errors: false,
      });
    }
  },
};

export const users = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default users;
