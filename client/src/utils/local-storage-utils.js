import { setExpiration, getExpiration } from './local-cache';

const isAvailable = (function isAvailableIffe() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}());

const util = {
  get(key) {
    if (isAvailable) {
      return localStorage.getItem(key);
    }
    return null;
  },

  remove(key) {
    if (isAvailable) {
      return localStorage.removeItem(key);
    }
    return null;
  },

  set(key, value) {
    if (isAvailable) {
      return localStorage.setItem(key, value);
    }

    return null;
  },
  getToken() {
    if (isAvailable) {
      if (localStorage.getCacheItem("user") === null) {
        return null;
      } else {
        var user = localStorage.getCacheItem('user');
        return user.token;
      }
    }
    return null;
  },
  getUsername() {
    if (isAvailable) {
      if (localStorage.getCacheItem("user") === null) {
        return null;
      } else {
        var user = localStorage.getCacheItem('user');
        return user.username;
      }
    }
    return null;
  },
  getUser() {
    if (isAvailable) {
      if (localStorage.getCacheItem("user") === null) {
        return null;
      } else {
        return localStorage.getCacheItem('user');
      }
    }
    return null;
  },
  setUser(responseData) {
    if (isAvailable) {

      return localStorage.setCacheItem('user', {
        token: responseData.data.token,
        email: responseData.data.email,
        firstName: responseData.data.firstName,
        lastName: responseData.data.lastName,
        username: responseData.data.username
      }, {days : 1 });

    }
    return null;
  },
  clearUser() {
    if (isAvailable) {
      return localStorage.removeItem('user');
    }
    return null;
  }
};

export default util;