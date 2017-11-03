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
import fetch from 'react-native-fetch-polyfill'
import isValidJson from 'is-valid-json'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import TYPE from './systemStatus.type'
import TYPEAPP from '../app/app.type'
import { config } from 'src/constant'
import { apiHeaders, apiURL, isValidServer } from 'src/lib'

//////////
// Init //
//////////
/**
 * [sync description]
 * @param  {[type]} server    [description]
 * @param  {[type]} gotStored [description]
 * @return {[type]}           [description]
 */
export function sync({ server, onDoneRead, onDoneGet, onDoneStore }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const { payload: stored, type: typeStored } = await read({ server, onDone: onDoneRead })(dispatch)
      const { payload: fetched, type: typeFetched } = await get({ server, onDone: onDoneGet })(dispatch)

      if (TYPE.hasOwnProperty(typeStored) && TYPE.hasOwnProperty(typeFetched) && !isEqual(stored, fetched)) {
        await store({ server, systemStatusObj: fetched, onDone: onDoneStore })(dispatch)
      }
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [read description]
 * @param  {[type]} server Server
 * @return {[type]}
 */
export function read({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const value = await AsyncStorage.getItem(`${config.storageKey.systemStatus}${server.key}`)
      const systemStatusObj = JSON.parse(value)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_SYSTEMSTATUS, payload: systemStatusObj })
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server  Server
 * @return {[type]}         [description]
 */
export function get({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      // Build URL
      const url = apiURL(server, 'system/status')
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching systemStatus at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()

      // It's an json, set it
      if (isValidJson(json)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_SYSTEMSTATUS, payload: json })
      }

      throw new Error(`Failed to handle fetched systemStatus data (${url})`)
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server          Server
 * @param  {[type]} systemStatusObj [description]
 * @return {[type]}
 */
export function store({ server, systemStatusObj, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!isValidJson(systemStatusObj)) {
        throw new Error('Failed to set/store systemStatus, it must be an json object')
      }

      await AsyncStorage.setItem(`${config.storageKey.systemStatus}${server.key}`, JSON.stringify(systemStatusObj))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_SYSTEMSTATUS, payload: systemStatusObj })
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [purge description]
 * @param  {[type]} server Server
 * @return {[type]}
 */
export function purge({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      await AsyncStorage.removeItem(`${config.storageKey.systemStatus}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_SYSTEMSTATUS, payload: [] })
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
