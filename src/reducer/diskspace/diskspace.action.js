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
import typechecker from 'typechecker'
import isValidJson from 'is-valid-json'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import TYPE from './diskspace.type'
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
        await store({ server, diskspaceArray: fetched, onDone: onDoneStore })(dispatch)
      }
    } catch (err) {
      console.warn(err)
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

      const value = await AsyncStorage.getItem(`${config.storageKey.diskspace}${server.key}`)
      const data = JSON.parse(value)
      const diskspaceArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_DISKSPACE, payload: diskspaceArray })
    } catch (err) {
      console.warn(err)
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
      const url = apiURL(server, 'diskspace')
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching diskspace at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const diskspaceData = isValidJson(json) && json

      // It's an array, set it
      if (typechecker.isArray(diskspaceData)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_DISKSPACE, payload: diskspaceData })
      }

      throw new Error(`Failed to handle fetched diskspace data (${url})`)
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server     Server
 * @param  {[type]} diskspaceArray [description]
 * @return {[type]}
 */
export function store({ server, diskspaceArray, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!typechecker.isArray(diskspaceArray)) {
        throw new Error('Failed to set/store diskspace, it must be an array')
      }

      await AsyncStorage.setItem(`${config.storageKey.diskspace}${server.key}`, JSON.stringify(diskspaceArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_DISKSPACE, payload: diskspaceArray })
    } catch (err) {
      console.warn(err)
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

      await AsyncStorage.removeItem(`${config.storageKey.diskspace}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_DISKSPACE, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
