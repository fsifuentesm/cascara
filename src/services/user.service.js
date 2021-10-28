import ApiService from './api.service';
import { getAuthToken } from '../utils/auth';

// TODO: dry
function authHeader() {
  const cAuth = getAuthToken();
  let auth = null;

  if (typeof window !== 'undefined') {
    auth = btoa(cAuth);
  } else {
    auth = new Buffer(cAuth).toString('base64');
  }

  if (auth) {
    return { Authorization: `Basic ${auth}` };
  }

  return { };
}

function getUsers() {
  return ApiService().get(
    '/v1/user',
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => data.items)
    .catch(error => Promise.reject(error));
}

function getUser(identifier) {
  const urlId = encodeURIComponent(identifier);

  return ApiService().get(
    `/v1/user/${urlId}`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => data)
    .catch(error => Promise.reject(error));
}

function getUserGroups(identifier) {
  const urlId = encodeURIComponent(identifier);

  return ApiService().get(
    `/v1/user/${urlId}/groups`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => data.items)
    .catch(error => Promise.reject(error));
}

function getUserPermissions(identifier) {
  const urlId = encodeURIComponent(identifier);

  return ApiService().get(
    `/v1/user/${urlId}/permissions`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => data.items)
    .catch(error => Promise.reject(error));
}

export const userService = {
  getUsers,
  getUser,
  getUserGroups,
  getUserPermissions,
};

export default {
  install(Vue, name = '$userService') {
    Object.defineProperty(Vue.prototype, name, { value: userService });
  },
};
