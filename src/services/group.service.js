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

function getGroups() {
  return ApiService().get(
    '/v1/group',
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => data.items)
    .catch(error => Promise.reject(error));
}

function getGroup(identifier) {
  const urlId = encodeURIComponent(identifier);
  return ApiService().get(
    `/v1/group/${urlId}`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => ({
      identifier: data.codename,
      name: data.name,
    }))
    .catch(error => Promise.reject(error));
}

export const groupService = {
  getGroups,
  getGroup,
};

export default {
  install(Vue, name = '$groupService') {
    Object.defineProperty(Vue.prototype, name, { value: groupService });
  },
};
