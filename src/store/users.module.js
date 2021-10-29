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

  getUserTasks({ commit }, identifier) {
    pointerService.getPointers({
      actoredUsers: [identifier],
      notifiedUsers: [identifier],
    })
      .then((res) => {
        commit('getUserTasksSuccess', {
          identifier,
          tasks: res.items.map(x => ({
            name: x.node.name, // TODO: fix in service
            identifier: x.id, // TODO: fix in service
            startedAt: x.started_at, // TODO: fix in service
            status: x.state, // TODO: fix in service
          })),
        });
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

  getUserTasksSuccess(ste, payload) {
    if (ste.allItems[payload.identifier]) {
      Vue.set(ste.allItems, payload.identifier, Object.assign(
        {
          ...ste.allItems[payload.identifier],
          data: {
            ...ste.allItems[payload.identifier].data,
            tasks: payload.tasks,
          },
          loading: false,
          errors: false,
        },
      ));
    } else {
      Vue.set(ste.allItems, payload.identifier, {
        data: {
          tasks: payload.tasks,
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
