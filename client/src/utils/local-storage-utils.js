/* eslint-disable no-unused-vars */
import { setExpiration, getExpiration } from './local-cache'

const isAvailable = (function isAvailableIffe () {
  const test = 'test'
  try {
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}())

const util = {
  get (key) {
    if (isAvailable) {
      return window.localStorage.getItem(key)
    }
    return null
  },

  remove (key) {
    if (isAvailable) {
      return window.localStorage.removeItem(key)
    }
    return null
  },

  set (key, value) {
    if (isAvailable) {
      return window.localStorage.setItem(key, value)
    }

    return null
  },
  getToken () {
    if (isAvailable) {
      if (window.localStorage.getCacheItem('user') === null) {
        return null
      } else {
        var user = window.localStorage.getCacheItem('user')
        return user.token
      }
    }
    return null
  },
  getUsername () {
    if (isAvailable) {
      if (window.localStorage.getCacheItem('user') === null) {
        return null
      } else {
        var user = window.localStorage.getCacheItem('user')
        return user.username
      }
    }
    return null
  },
  getUser () {
    if (isAvailable) {
      if (window.localStorage.getCacheItem('user') === null) {
        return null
      } else {
        return window.localStorage.getCacheItem('user')
      }
    }
    return null
  },
  getFavoriteClips () {
    if (isAvailable) {
      if (window.localStorage.getCacheItem('user') === null) {
        return null
      } else {
        var user = window.localStorage.getCacheItem('user')
        return user.favoriteClips
      }
    }
    return null
  },
  updateUser (userObj) {
    if (isAvailable) {
      userObj.isJson = true
      return window.localStorage.setItem('user', JSON.stringify(userObj))
    }
    return null
  },
  setUser (responseData, rememberUser) {
    if (isAvailable) {
      const days = rememberUser ? 30 : 1

      return window.localStorage.setCacheItem('user', {
        token: responseData.data.token,
        email: responseData.data.email,
        firstName: responseData.data.firstName,
        favoriteClips: responseData.data.favoriteClips,
        lastName: responseData.data.lastName,
        username: responseData.data.username
      }, { days: days })
    }
    return null
  },
  clearUser () {
    if (isAvailable) {
      return window.localStorage.removeItem('user')
    }
    return null
  }
}

export default util
