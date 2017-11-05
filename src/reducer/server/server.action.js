/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { AsyncStorage } from 'react-native'

/////////////////
// Third-party //
/////////////////
import typechecker from 'typechecker'

////////////
// Custom //
////////////
import TYPE from './server.type'
import TYPEAPP from '../app/app.type'
import { config } from 'src/constant'
import { fixHost, fixPort, fixUrlBase, isValidServer, randomString } from 'src/lib'

//////////
// Init //
//////////
/**
 * [get description]
 * @return {[type]}
 */
export function get() {
  return async dispatch => {
    try {
      const value = await AsyncStorage.getItem(config.storageKey.server)
      const data = JSON.parse(value)
      const serverArray = typechecker.isArray(data) ? data : []

      return dispatch({ type: TYPE.SET_SERVER, payload: serverArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server [description]
 * @return {[type]}
 */
export function store(server) {
  return async dispatch => {
    try {
      // Replace if array
      if (typechecker.isArray(server)) {
        server.map(each => {
          if (!isValidServer(each)) {
            throw new Error('Server invalid')
          }
          return {
            ...each,
            host   : fixHost(each.host),
            port   : fixPort(each.port),
            urlBase: fixUrlBase(each.urlBase),
          }
        })

        await AsyncStorage.setItem(config.storageKey.server, JSON.stringify(server))
        return dispatch({ type: TYPE.SET_SERVER, payload: server })
      }

      // Is valid, skiping 'key' check
      if (!isValidServer(server, [ 'key' ])) {
        throw new Error('Server invalid')
      }

      // Sanitize
      server = {
        ...server,
        host   : fixHost(server.host),
        port   : fixPort(server.port),
        urlBase: fixUrlBase(server.urlBase),
      }

      // Get stored array and add/replace server object
      const value = await AsyncStorage.getItem(config.storageKey.server)
      const data = JSON.parse(value)
      const serverArray = typechecker.isArray(data) ? data : []

      if (server.key) {
        // Look for specific server
        const index = serverArray.findIndex(each => each.key === server.key)

        if (index === -1) {
          // Did not find the key, just add the server
          serverArray.push(server)
        } else {
          // If found, replace it's values
          serverArray[index] = server
        }
      } else {
        // Get string and make sure it's unique
        let uniqueKey = randomString()
        while (serverArray.some(e => e.key === uniqueKey)) {
          uniqueKey = randomString()
        }

        // Add new server
        server.key = uniqueKey
        serverArray.push(server)
      }

      await AsyncStorage.setItem(config.storageKey.server, JSON.stringify(serverArray))
      return dispatch({ type: TYPE.SET_SERVER, payload: serverArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [remove description]
 * @param  {[type]} server [description]
 * @return {[type]}
 */
export function remove(server) {
  return async dispatch => {
    try {
      const value = await AsyncStorage.getItem(config.storageKey.server)
      const data = JSON.parse(value)
      const serverArray = typechecker.isArray(data) ? data : []

      // No specific server
      if (!server.key) {
        throw new Error('Server has no unique key')
      }

      // No stored server
      if (serverArray.length === 0) {
        return dispatch({ type: TYPE.SET_SERVER, payload: [] })
      }

      // Only one server
      if (server.length === 1) {
        await AsyncStorage.removeItem(config.storageKey.server)
        return dispatch({ type: TYPE.SET_SERVER, payload: [] })
      }

      // Look for specific server index
      const index = serverArray.findIndex(each => each.key === server.key)

      // Not found
      if (index === -1) {
        throw new Error('Server not found')
      }

      // Remove from array
      serverArray.splice(index, 1)
      await AsyncStorage.setItem(config.storageKey.server, JSON.stringify(serverArray))

      return dispatch({ type: TYPE.SET_SERVER, payload: serverArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [purge description]
 * @return {[type]}
 */
export function purge() {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem(config.storageKey.server)

      return dispatch({ type: TYPE.SET_SERVER, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message } })
    }
  }
}

/**
 * [setActive description]
 * @param  {[type]} server [description]
 * @return {[type]}
 */
export function setActive(server) {
  try {
    if (!isValidServer(server)) {
      return { type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: 'Server invalid' } }
    }

    return { type: TYPE.SET_SERVER_ACTIVE, payload: server }
  } catch (err) {
    console.warn(err)
    return { type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message } }
  }
}
